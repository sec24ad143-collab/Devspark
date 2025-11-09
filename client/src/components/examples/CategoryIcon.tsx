import CategoryIcon from "../CategoryIcon";

export default function CategoryIconExample() {
  const categories = ["Water", "Power", "Roads", "Sanitation", "Public Safety", "Healthcare", "Education", "Other"];

  return (
    <div className="p-8 flex gap-6 flex-wrap">
      {categories.map((cat) => (
        <div key={cat} className="flex flex-col items-center gap-2">
          <CategoryIcon category={cat} className="w-8 h-8 text-primary" />
          <span className="text-sm text-muted-foreground">{cat}</span>
        </div>
      ))}
    </div>
  );
}
