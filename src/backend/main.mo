import Text "mo:core/Text";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Debug "mo:core/Debug";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

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

  public type AIPrediction = {
    id : Nat;
    analysis : Text;
    confidence : Float;
    isVisible : Bool;
  };

  public type OddsTrainLeg = {
    match_id : Nat;
    outcome : Text;
    odds : Float;
    status : TicketStatus;
  };

  public type OddsTrain = {
    legs : [OddsTrainLeg];
    completed_legs : Nat;
    remaining_legs : Nat;
    estimated_payout : Float;
  };

  public type Notification = {
    message : Text;
    timestamp : Time.Time;
  };

  public type GamificationBadge = {
    id : Nat;
    name : Text;
    description : Text;
    earned : Bool;
  };

  public type LeaderboardEntry = {
    user_id : Nat;
    rank : Nat;
  };

  public type VIPSubscription = {
    user_id : Nat;
    subscription_type : SubscriptionType;
    expiration_date : Time.Time;
    trial : Bool;
  };

  public type Game = {
    multiplier : Float;
    duration : Float;
    timestamp : Time.Time;
    flight_curve : ?[Float];
  };

  public type Pattern = {
    name : Text;
    description : Text;
    pattern : Text;
    detected : Bool;
  };

  public type Analytics = {
    mean : Float;
    median : Float;
    std_dev : Float;
    min : Float;
    max : Float;
    q_25 : Float;
    q_75 : Float;
    under_1x : Nat;
    x_1_to_2 : Nat;
    x_2_to_5 : Nat;
    x_5_to_10 : Nat;
    x_10_plus : Nat;
  };

  public type MonteCarloParameters = {
    n_simulations : Nat;
    strategy : Text;
    initial_balance : Float;
    bet_amount : Float;
  };

  public type MonteCarloResults = {
    ending_balance_distribution : [Float];
    average_return : Float;
    probability_of_ruin : Float;
  };

  public type MonteCarloSimulation = {
    parameters : MonteCarloParameters;
    results : MonteCarloResults;
    interpretation : Text;
  };

  public type AviatorDiscovery = {
    app_name : Text;
    version : Text;
    available_methods : [Text];
  };

  public type Empty = {};

  let users = Map.empty<Principal, User>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var games = List.empty<Game>();
  var nextMatchId = 1;
  var nextGameId = 0;
  let matches = Map.empty<Nat, Match>();
  let analyses = Map.empty<Nat, Analysis>();
  var nextTicketId = 1;
  let tickets = Map.empty<Nat, Ticket>();
  let results = Map.empty<Nat, TicketStatus>();
  var hasBootstrappedAdmin = false;

  var nextPredictionId = 1;
  var oddsTrain = List.empty<OddsTrainLeg>();

  let notifications = Map.empty<Principal, List.List<Notification>>();
  let aiPredictions = Map.empty<Nat, AIPrediction>();

  func hasVIPSubscription(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.subscription_type) {
          case (#basic or #premium) { true };
          case (#free) { false };
        };
      };
    };
  };

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

  public query ({ caller }) func isAdminBootstrapAvailable() : async Bool {
    not hasBootstrappedAdmin;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
    syncUserWithProfile(caller);
  };

  public query ({ caller }) func getRecentGames() : async [Game] {
    games.toArray();
  };

  public shared ({ caller }) func addGame(game : Game) : async () {
    let newGameList = List.fromArray<Game>([game]);
    games := newGameList;
  };

  let patterns : [Pattern] = [
    {
      name = "Sequential";
      description = "Repeating or incrementing/ decrementing patterns.";
      pattern = "1.2x, 1.3x, 1.4x, 1.5x";
      detected = false;
    },
    {
      name = "Range";
      description = "Clustered within a specific range.";
      pattern = "2.0x - 2.5x";
      detected = false;
    },
    {
      name = "Volatility Spike";
      description = "Sudden shift from low to high multipliers or vice versa.";
      pattern = "1x-2x, 1x-2x, 10x-20x";
      detected = false;
    },
    {
      name = "Repeating";
      description = "Recurring patterns (e.g. alternating between low and high values).";
      pattern = "1x-2x, 10x-20x";
      detected = false;
    },
    {
      name = "Plateau";
      description = "Sustained period of similar multiplier values.";
      pattern = "1.1x - 1.3x";
      detected = false;
    },
    {
      name = "Peak/Trough";
      description = "Sequences building up to a peak value and then declining.";
      pattern = "1x, 2x, 4x, 8x, 16.x, 4x, 2x, 1x";
      detected = false;
    },
  ];

  public query ({ caller }) func getPatterns() : async [Pattern] {
    patterns;
  };
};
