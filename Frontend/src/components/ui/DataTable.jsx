import Pill from "./Pill.jsx";

export default function DataTable({ columns, rows, statusToneMap = {} }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="text-left font-body text-xs text-ink-faint">
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-3 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-line">
              {columns.map((col) => (
                <td key={col.key} className={`px-5 py-3 font-body ${col.className || ""}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { Pill };
