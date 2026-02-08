import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Enable persistent state with migration.
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type SubscriptionType = {
    #free;
    #basic;
    #premium;
  };

  module SubscriptionType {
    public func compare(a : SubscriptionType, b : SubscriptionType) : Order.Order {
      switch (a, b) {
        case (#free, #free) { #equal };
        case (#free, _) { #less };
        case (#basic, #free) { #greater };
        case (#basic, #basic) { #equal };
        case (#basic, _) { #less };
        case (#premium, #premium) { #equal };
        case (#premium, _) { #greater };
      };
    };
  };

  public type ConfidenceLevel = {
    #veryHigh;
    #high;
    #moderate;
    #low;
  };

  module ConfidenceLevel {
    public func compare(a : ConfidenceLevel, b : ConfidenceLevel) : Order.Order {
      switch (a, b) {
        case (#veryHigh, #veryHigh) { #equal };
        case (#veryHigh, _) { #less };
        case (#high, #veryHigh) { #greater };
        case (#high, #high) { #equal };
        case (#high, _) { #less };
        case (#moderate, #moderate) { #equal };
        case (#moderate, #low) { #less };
        case (#moderate, _) { #greater };
        case (#low, #low) { #equal };
        case (#low, _) { #greater };
      };
    };
  };

  public type TicketType = {
    #safe;
    #value;
    #train;
  };

  module TicketType {
    public func compare(a : TicketType, b : TicketType) : Order.Order {
      switch (a, b) {
        case (#safe, #safe) { #equal };
        case (#safe, _) { #less };
        case (#value, #safe) { #greater };
        case (#value, #value) { #equal };
        case (#value, _) { #less };
        case (#train, #train) { #equal };
        case (#train, _) { #greater };
      };
    };
  };

  public type TicketStatus = {
    #pending;
    #win;
    #loss;
  };

  public type Match = {
    league : Text;
    teams : Text;
    kickoff_date : Time.Time;
  };

  public type Analysis = {
    match_id : Nat;
    form : [Text];
    head_to_head : [Text];
    tactical_insight : Text;
    confidence_level : ConfidenceLevel;
  };

  module Analysis {
    public func compareByConfidence(a : Analysis, b : Analysis) : Order.Order {
      ConfidenceLevel.compare(a.confidence_level, b.confidence_level);
    };
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    subscription_type : SubscriptionType;
    join_date : Time.Time;
  };

  public type User = {
    name : Text;
    email : Text;
    subscription_type : SubscriptionType;
    join_date : Time.Time;
  };

  module User {
    public func compareBySubscriptionType(a : User, b : User) : Order.Order {
      SubscriptionType.compare(a.subscription_type, b.subscription_type);
    };
  };

  public type Ticket = {
    ticket_type : TicketType;
    odds : Float;
    selections : [Nat];
    status : TicketStatus;
  };

  module Ticket {
    public func compareByType(a : Ticket, b : Ticket) : Order.Order {
      TicketType.compare(a.ticket_type, b.ticket_type);
    };
  };

  let users = Map.empty<Principal, User>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextMatchId = 1;
  let matches = Map.empty<Nat, Match>();
  let analyses = Map.empty<Nat, Analysis>();
  var nextTicketId = 1;
  let tickets = Map.empty<Nat, Ticket>();
  let results = Map.empty<Nat, TicketStatus>();
  var hasBootstrappedAdmin = false;

  // Sync user with user profile.
  func syncUserWithProfile(caller : Principal) {
    switch (userProfiles.get(caller)) {
      case (?validProfile) {
        let newUser : User = {
          name = validProfile.name;
          email = validProfile.email;
          subscription_type = validProfile.subscription_type;
          join_date = validProfile.join_date;
        };
        users.add(caller, newUser);
      };
      case (null) { users.remove(caller) };
    };
  };

  // Bootstrap: Grant admin to first caller if no admin exists yet.
  public shared ({ caller }) func bootstrapAdmin() : async () {
    // Check if already bootstrapped
    if (hasBootstrappedAdmin) {
      Runtime.trap("Admin already bootstrapped");
    };

    // Create initial admin profile without requiring user permission
    let initialProfile : UserProfile = {
      name = "Initial Admin";
      email = "admin@example.com";
      subscription_type = #premium;
      join_date = Time.now();
    };

    userProfiles.add(caller, initialProfile);
    syncUserWithProfile(caller);

    // Assign admin role - this is safe because assignRole has internal admin checks
    // but on first call when there are no admins, it should allow bootstrapping
    AccessControl.assignRole(accessControlState, caller, caller, #admin);

    hasBootstrappedAdmin := true;
  };

  // Admin-only: Promote a user to admin role.
  public shared ({ caller }) func promoteToAdmin(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can promote users");
    };

    // Ensure the user has a profile (is registered)
    switch (userProfiles.get(user)) {
      case (null) {
        Runtime.trap("User must have a profile before being promoted to admin");
      };
      case (?_profile) {
        AccessControl.assignRole(accessControlState, caller, user, #admin);
      };
    };
  };

  // Check if admin panel should be visible to caller.
  public query ({ caller }) func isAdminPanelVisible() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Admin-only: Add match.
  public shared ({ caller }) func addMatch(league : Text, teams : Text, kickoff_date : Time.Time) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let matchId = nextMatchId;
    let newMatch : Match = {
      league;
      teams;
      kickoff_date;
    };
    matches.add(matchId, newMatch);
    nextMatchId += 1;
    matchId;
  };

  // Admin-only: Add analysis.
  public shared ({ caller }) func addAnalysis(match_id : Nat, form : [Text], head_to_head : [Text], tactical_insight : Text, confidence_level : ConfidenceLevel) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let newAnalysis : Analysis = {
      match_id;
      form;
      head_to_head;
      tactical_insight;
      confidence_level;
    };
    analyses.add(match_id, newAnalysis);
  };

  // Admin-only: Create ticket.
  public shared ({ caller }) func createTicket(ticket_type : TicketType, odds : Float, selections : [Nat]) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let ticketId = nextTicketId;
    let newTicket : Ticket = {
      ticket_type;
      odds;
      selections;
      status = #pending;
    };
    tickets.add(ticketId, newTicket);
    nextTicketId += 1;
    ticketId;
  };

  // Admin-only: Update ticket result (for Admin Panel 'Update Results').
  public shared ({ caller }) func updateTicketResult(ticketId : Nat, result : TicketStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    // Verify ticket exists
    switch (tickets.get(ticketId)) {
      case (null) {
        Runtime.trap("Ticket not found");
      };
      case (?ticket) {
        // Update the result
        results.add(ticketId, result);

        // Also update the ticket status
        let updatedTicket : Ticket = {
          ticket_type = ticket.ticket_type;
          odds = ticket.odds;
          selections = ticket.selections;
          status = result;
        };
        tickets.add(ticketId, updatedTicket);
      };
    };
  };

  // Admin-only: Calculate accuracy (for Admin Panel 'Track Accuracy').
  public query ({ caller }) func calculateAccuracy() : async Float {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let resultsArray = results.values().toArray();
    let nonPendingResults = resultsArray.filter(
      func(status) {
        status != #pending;
      }
    );
    let completedResults = nonPendingResults.size();
    if (completedResults == 0) { return 0.0; };
    let winCount = nonPendingResults.filter(
      func(status) { status == #win }
    ).size();
    winCount.toFloat() / completedResults.toFloat() * 100.0;
  };

  // Admin-only: Get all results with ticket IDs (for Admin Panel).
  public query ({ caller }) func getAllResultsWithTickets() : async [(Nat, TicketStatus)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    results.toArray();
  };

  // Public: Get all matches (accessible to all including guests).
  public query ({ caller }) func getAllMatches() : async [(Nat, Match, ?Analysis)] {
    matches.toArray().map(func((matchId, match)) { (matchId, match) }).map(
      func((matchId, match)) {
        let analysis = analyses.get(matchId);
        (matchId, match, analysis);
      }
    );
  };

  // Public: Get matches by confidence level (accessible to all including guests).
  public query ({ caller }) func getMatchesByConfidenceLevel(level : ConfidenceLevel) : async [(Nat, Match, Analysis)] {
    let filteredAnalyses = analyses.filter(func(_id, analysis) { analysis.confidence_level == level });
    let filteredResults = filteredAnalyses.toArray().map(
      func((analysisId, analysis)) {
        let match = matches.get(analysisId);
        (analysisId, match, analysis);
      }
    );
    filteredResults.filter(func(_item) { true }).map(func(item) { switch (item) { case (id, ?match, analysis) { (id, match, analysis) }; case (_) { Runtime.trap("Unreachable resource computation") } } });
  };

  // Required by frontend: Get caller's own profile.
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  // Get user profile (own profile or admin can view any).
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Save caller's own profile.
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
    syncUserWithProfile(caller);
  };

  // Upgrade subscription (user can only upgrade their own).
  public shared ({ caller }) func upgradeSubscription(newType : SubscriptionType) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upgrade");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?existingProfile) {
        let updatedProfile : UserProfile = {
          name = existingProfile.name;
          email = existingProfile.email;
          subscription_type = newType;
          join_date = existingProfile.join_date;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
    syncUserWithProfile(caller);
  };

  // Get ticket (VIP content - requires subscription check).
  public query ({ caller }) func getTicket(ticketId : Nat) : async ?Ticket {
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: VIP subscription required to view tickets");
      };
      case (?userProfile) {
        switch (userProfile.subscription_type) {
          case (#free) {
            Runtime.trap("Unauthorized: VIP subscription required to view tickets");
          };
          case (#basic or #premium) {
            tickets.get(ticketId);
          };
        };
      };
    };
  };

  // Get all tickets (VIP content - requires subscription check).
  public query ({ caller }) func getAllTickets() : async [(Nat, Ticket)] {
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: VIP subscription required to view tickets");
      };
      case (?userProfile) {
        switch (userProfile.subscription_type) {
          case (#free) {
            Runtime.trap("Unauthorized: VIP subscription required to view tickets");
          };
          case (#basic or #premium) {
            tickets.toArray();
          };
        };
      };
    };
  };

  // Get user subscription (own subscription or admin can view any).
  public query ({ caller }) func getUserSubscription(user : Principal) : async ?SubscriptionType {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own subscription");
    };
    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?userProfile) { ?userProfile.subscription_type };
    };
  };

  // Admin-only: Get all users.
  public query ({ caller }) func getAllUsers() : async [User] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    users.values().toArray().sort(User.compareBySubscriptionType);
  };

  // Get ticket types (VIP content - requires subscription check).
  public query ({ caller }) func getTicketTypes() : async [(Nat, TicketType)] {
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: VIP subscription required to view ticket types");
      };
      case (?userProfile) {
        switch (userProfile.subscription_type) {
          case (#free) {
            Runtime.trap("Unauthorized: VIP subscription required to view ticket types");
          };
          case (#basic or #premium) {
            tickets.toArray().map(func((id, ticket)) { (id, ticket.ticket_type) });
          };
        };
      };
    };
  };

  // Public: Get all analyses (accessible to all including guests).
  public query ({ caller }) func getAllAnalyses() : async [Analysis] {
    analyses.values().toArray().sort(Analysis.compareByConfidence);
  };

  // Get user result (VIP content - requires subscription check).
  public query ({ caller }) func getResult(ticketId : Nat) : async ?TicketStatus {
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: VIP subscription required to view ticket results");
      };
      case (?userProfile) {
        switch (userProfile.subscription_type) {
          case (#free) {
            Runtime.trap("Unauthorized: VIP subscription required to view ticket results");
          };
          case (#basic or #premium) {
            results.get(ticketId);
          };
        };
      };
    };
  };

  // Get all results (VIP content - requires subscription check).
  public query ({ caller }) func getAllResults() : async [TicketStatus] {
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: VIP subscription required to view ticket results");
      };
      case (?userProfile) {
        switch (userProfile.subscription_type) {
          case (#free) {
            Runtime.trap("Unauthorized: VIP subscription required to view ticket results");
          };
          case (#basic or #premium) {
            results.values().toArray();
          };
        };
      };
    };
  };
};
