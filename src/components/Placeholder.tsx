
export function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-4">
        {title}
      </h1>
      <p className="text-muted-foreground text-lg">
        Esta funcionalidade está sendo construída. Mantenha o foco no hoje.
      </p>
    </div>
  );
}
