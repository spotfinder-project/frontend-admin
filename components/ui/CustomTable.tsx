// components/CustomTable.tsx

import React from "react";

interface Column {
  id: string;
  label: string;
}

interface TableData {
  id: string;
  [key: string]: any;
}

interface CustomTableProps {
  columns: Column[];
  data: TableData[];
  selectedRows: string[];
  rowsPerPage: number;
  page: number;
  resolvedType?: string;
  handleChangeResolvedType?: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRow: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  onEdit?: (item: TableData) => void;
  onItemClick?: (item: TableData) => void;
  onDelete?: (item: TableData) => void;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  selectedRows,
  rowsPerPage,
  page,
  resolvedType,
  onSelectAll,
  onSelectRow,
  onEdit,
  onItemClick,
  onDelete,
  handleChangeResolvedType,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className="checkbox"
                checked={data.length > 0 && selectedRows.length === data.length}
                // Optionally, handle indeterminate state
                onChange={onSelectAll}
              />
            </th>
            {columns.map((column) => (
              <th key={column.id}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item) => (
              <tr
                key={item.id}
                className={`hover ${
                  selectedRows.indexOf(item.id) !== -1 ? "active" : ""
                }`}
              >
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedRows.indexOf(item.id) !== -1}
                    onChange={(event) => onSelectRow(event, item.id)}
                  />
                </td>
                {columns.map((column) => {
                  if (column.id === "edit") {
                    return (
                      <td key="edit">
                        <button
                          className="btn btn-neutral"
                          onClick={() => onEdit?.(item)}
                        >
                          Edit
                        </button>
                      </td>
                    );
                  } else if (
                    column.id === "resolved" &&
                    handleChangeResolvedType
                  ) {
                    return (
                      <td key="resolved">
                        <select
                          id="resolvedType"
                          className="select select-bordered"
                          value={item.resolved}
                          onChange={(e) => handleChangeResolvedType(e)}
                        >
                          <option value="" disabled>
                            상태
                          </option>
                          <option value="N">해결 요청</option>
                          <option value="Y">해결 완료</option>
                        </select>
                      </td>
                    );
                  } else if (column.id === "delete" && onDelete) {
                    return (
                      <td key="delete">
                        <button
                          className="btn btn-neutral"
                          onClick={() => onDelete(item)}
                        >
                          Delete
                        </button>
                      </td>
                    );
                  } else {
                    return (
                      <td key={column.id} onClick={() => onItemClick?.(item)}>
                        {(item as any)[column.id]}
                      </td>
                    );
                  }
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
