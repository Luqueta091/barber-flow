interface TimeSlotsProps {
  selectedTime?: string;
}

const TimeSlots = ({ selectedTime = "14:00" }: TimeSlotsProps) => {
  const morningSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
  const afternoonSlots = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
  const unavailableSlots = ["09:00", "10:30", "14:30", "16:00"];

  const renderSlot = (time: string) => {
    const isSelected = time === selectedTime;
    const isUnavailable = unavailableSlots.includes(time);

    return (
      <button
        key={time}
        className={
          isUnavailable
            ? "chip-disabled"
            : isSelected
            ? "chip-selected"
            : "chip-default"
        }
        disabled={isUnavailable}
      >
        {time}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Morning */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Manhã</h4>
        <div className="flex flex-wrap gap-2">
          {morningSlots.map(renderSlot)}
        </div>
      </div>

      {/* Afternoon */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Tarde</h4>
        <div className="flex flex-wrap gap-2">
          {afternoonSlots.map(renderSlot)}
        </div>
      </div>
    </div>
  );
};

export default TimeSlots;
