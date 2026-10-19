import Card from "@/components/kanban/Card";
import DarkModeSwitch from "@/components/kanban/DarkModeSwitch";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-4 p-8 font-sans">
      <DarkModeSwitch />
      <Card
        id="1"
        title="Set up database"
        description="Create the tasks table in Neon."
        status="new"
      />
      <Card
        id="2"
        title="Build card component"
        description="Draggable card with title, description and status."
        status="in-progress"
      />
      <Card
        id="3"
        title="Initialise backend"
        description="Express.js server with Postgres connection."
        status="done"
      />
      <Card
        id="4"
        title="Old prototype"
        description="No longer needed."
        status="archive"
      />
    </div>
  );
}
