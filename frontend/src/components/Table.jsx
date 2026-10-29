// columns: [{ key, label, render?(row), align? }]
// actions: (row) => JSX shown in the last column
export default function Table({ columns, rows, actions, rowKey = "id", empty = "Nothing here yet." }) {
  const span = columns.length + (actions ? 1 : 0);
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.align === "right" ? "num" : undefined}>
                {c.label}
              </th>
            ))}
            {actions && (
              <th>
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="empty" colSpan={span}>
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row[rowKey]}>
                {columns.map((c) => (
                  <td key={c.key} className={c.align === "right" ? "num" : undefined}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
                {actions && (
                  <td className="actions">
                    <div className="row-actions">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
