import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Game } from '@/backend';

interface GamesTableProps {
  games: Game[];
}

export default function GamesTable({ games }: GamesTableProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No games to display
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="font-semibold">Multiplier</TableHead>
            <TableHead className="font-semibold">Duration (s)</TableHead>
            <TableHead className="font-semibold">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game, index) => {
            const timestamp = new Date(Number(game.timestamp) / 1_000_000);
            return (
              <TableRow key={index} className="hover:bg-secondary/30">
                <TableCell className="font-bold text-primary">
                  {game.multiplier.toFixed(2)}x
                </TableCell>
                <TableCell>{game.duration.toFixed(2)}s</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {timestamp.toLocaleTimeString()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
