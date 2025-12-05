import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarUIProps {
  selectedDay?: number;
}

const CalendarUI = ({ selectedDay = 15 }: CalendarUIProps) => {
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const emptyDays = 2; // Offset for the first day of the month

  return (
    <div className="card-base p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h3 className="text-lg font-semibold text-foreground">Dezembro 2024</h3>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: emptyDays }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {days.map((day) => {
          const isSelected = day === selectedDay;
          const isPast = day < 10;
          const isToday = day === 10;

          return (
            <button
              key={day}
              className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isPast
                  ? "text-muted-foreground/50 cursor-not-allowed"
                  : isToday
                  ? "bg-secondary text-foreground ring-2 ring-primary"
                  : "text-foreground hover:bg-secondary"
              }`}
              disabled={isPast}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarUI;
