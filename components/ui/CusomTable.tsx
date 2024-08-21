// components/CustomTable.tsx

import React from "react";

interface Column {
  id: string;
  label: string;
}

interface User {
  id: number;
  [key: string]: any;
}

interface CustomTableProps {
  columns: Column[];
  data: User[];
  selectedRows: number[];
  rowsPerPage: number;
  page: number;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRow: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  onEdit: (user: User) => void;
  onUserClick: (user: User) => void;
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
  onUserClick,
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
            .map((user) => (
              <tr
                key={user.id}
                className={`hover ${
                  selectedRows.indexOf(user.id) !== -1 ? "active" : ""
                }`}
              >
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedRows.indexOf(user.id) !== -1}
                    onChange={(event) => onSelectRow(event, user.id)}
                  />
                </td>
                {columns.map((column) =>
                  column.id !== "edit" ? (
                    <td key={column.id} onClick={() => onUserClick(user)}>
                      {(user as any)[column.id]}
                    </td>
                  ) : (
                    <td key="edit">
                      <button
                        className="btn btn-neutral"
                        onClick={() => onEdit(user)}
                      >
                        Edit
                      </button>
                    </td>
                  )
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
