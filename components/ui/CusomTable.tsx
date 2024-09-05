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
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRow: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  onEdit: (item: TableData) => void;
  onItemClick: (item: TableData) => void;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  selectedRows,
  rowsPerPage,
  page,
  onSelectAll,
  onSelectRow,
  onEdit,
  onItemClick,
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
                          onClick={() => onEdit(item)}
                        >
                          Edit
                        </button>
                      </td>
                    );
                  } else if (column.id === "resolved") {
                    return;
                  } else {
                    return (
                      <td key={column.id} onClick={() => onItemClick(item)}>
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
