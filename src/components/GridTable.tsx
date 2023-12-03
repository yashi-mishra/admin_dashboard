import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { User, UserRowData } from "../interfaces/User.interface";
import { ColDef } from "ag-grid-community";
import { Button, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";

const GridTable: React.FC = () => {
  const [rowData, setRowData] = useState<UserRowData[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);

  useEffect(() => {
    axios
      .get<User[]>(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((response) => {
        const formattedData = response.data;
        setRowData(formattedData as UserRowData[]);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const startEditing = (id: string) => {
    gridApi.startEditingCell({
        rowIndex: rowData.findIndex((row) => row.id === id),
        colKey: "name",
      });
  };

  const deleteRow = (id: string) => {
    const updatedRows = rowData.filter((row) => row.id !== id);
    setRowData(updatedRows);
  };

  const getColumnDefs = () => {
    return [
      {
        headerName: "",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        maxWidth: 50,
        cellClass: "ag-serial-no-column",
        pinned: "left",
        colId: 'checkbox'
      },
      {
        headerName: "Name",
        field: "name",
        key: "name",
        flex: 1,
        editable: true,
      },
      {
        headerName: "Email",
        field: "email",
        key: "email",
        flex: 1,
        editable: true,
      },
      {
        headerName: "Role",
        field: "role",
        key: "role",
        editable: true,
      },
      {
        headerName: "Action",
        colId: "action",
        cellRenderer: (params: any) => (
          <Space size="middle">
            <Button
              className="edit-row"
              onClick={() => startEditing(params.data.id)}
            >
              <EditOutlined style={{ color: "blue" }} />
            </Button>
            <Button
              className="delete-row"
              onClick={() => deleteRow(params.data.id)}
            >
              <DeleteOutlined style={{ color: "red" }} />
            </Button>
          </Space>
        ),
      },
    ] as ColDef[];
  };

  const onGridReady = useCallback((params: any) => {
    setGridApi(params.api);
  }, []);

  const onDeleteButtonClick = () => {
    const selectedData = gridApi.getSelectedRows();
    setRowData(rowData.filter((row) => !selectedData.includes(row)));
  };

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: 680, width: "100%", padding: "5rem 3rem" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <Search className="search-bar" placeholder="Search" />
        <Button
          className="delete-bulk"
          style={{ marginLeft: "2rem", backgroundColor: "#f5545f" }}
          type="primary"
          onClick={onDeleteButtonClick}
        >
          <DeleteOutlined />
        </Button>
      </div>
      <AgGridReact
        rowData={rowData}
        columnDefs={getColumnDefs()}
        pagination={true}
        paginationPageSize={10}
        rowSelection="multiple"
        suppressRowClickSelection={true}
        animateRows={true}
        getRowId={(params: any) => params.data.id}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
        }}
        cacheBlockSize={10}
        paginationPageSizeSelector={false}
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default GridTable;
