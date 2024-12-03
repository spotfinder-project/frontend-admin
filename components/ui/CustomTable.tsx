// components/CustomTable.tsx

import React from "react";
import { TableData } from '@/types/types'

interface Column {
  id: string;
  label: string;
}

interface CustomTableProps<T extends TableData> {
  columns: Column[];
  data: TableData[];
  selectedRows?: string[];
  rowsPerPage: number;
  page: number;
  resolvedType?: string;
  handleChangeTableValue?: (
    event: React.ChangeEvent<HTMLSelectElement>,
    item: TableData
  ) => void;
  onSelectAll?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRow?: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => void;
  onEdit?:(item: T) => void;
  onDelete?:(item: T) => void;
}

const CustomTable: React.FC<CustomTableProps<TableData>> = ({
  columns,
  data,
  selectedRows,
  rowsPerPage,
  page,
  resolvedType,
  onSelectAll,
  onSelectRow,
  onEdit,
  onDelete,
  handleChangeTableValue,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>
              {selectedRows && (
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={
                    data.length > 0 && selectedRows.length === data.length
                  }
                  // Optionally, handle indeterminate state
                  onChange={onSelectAll}
                />
              )}
            </th>
            {columns.map((column) => (
              <th key={column.id}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className={`hover`}>
              <td>
                {selectedRows && onSelectRow && (
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedRows.indexOf(item.id) !== -1}
                    onChange={(event) => onSelectRow(event, item.id)}
                  />
                )}
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
                } else if (column.id === "resolved" && handleChangeTableValue) {
                  return (
                    <td key="resolved">
                      <select
                        id="resolvedType"
                        className="select select-bordered"
                        value={item.resolved}
                        onChange={(e) => handleChangeTableValue(e, item)}
                      >
                        <option value="" disabled>
                          상태
                        </option>
                        <option value="N">해결 요청</option>
                        <option value="Y">해결 완료</option>
                      </select>
                    </td>
                  );
                } else if (column.id === "valid" && handleChangeTableValue) {
                  return (
                    <td key="valid">
                      <select
                        id="valid"
                        className="select select-bordered"
                        value={item.valid}
                        onChange={(e) => handleChangeTableValue(e, item)}
                      >
                        {/* <option value="" disabled>
                            상태
                          </option> */}
                        <option value="Y">게시 중</option>
                        <option value="N">게시 중지</option>
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
                    <td
                      key={column.id}
                      className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                    >
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
