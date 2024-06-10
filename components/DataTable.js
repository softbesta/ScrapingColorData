
import DataTable from "react-data-table-component";

const ToggleButton = () => {

}

export const CustomTable = ({
  rows,
  onChange,
  onToggleItem,
  onRemoveItem,
}) => {
  const columns = [
    // {
    //   name: "ID",
    //   selector: (row) => row.siteId,
    //   // sortable: true,
    //   width: '18px',
    //   compact: 'true',
    // },
    {
      name: "URL",
      // selector: (row) => row.url,
      // sortable: true,
      width: '200px',
      cell: (row) => {
        return <div
          style={{
          }}
        >
          <input
            className="inputText"
            type="text"
            name='url'
            value={row.url}
            onChange={(e) => onChange(e, row.siteId)}
          />
        </div>
      }
    },
    {
      name: "Status",
      selector: (row) => row.isOpen.toString(),
      // sortable: true,
      width: '50px',
      compact: 'true',
      cell: (row) => {
        return <div
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: `${row.isOpen ? 'green' : 'red'}`,
            borderRadius: 100,
          }}
        >
        </div>
      },
    },
    {
      name: "X",
      // selector: (row) => row.x,
      // sortable: true,
      width: '100px',
      compact: 'true',
      cell: (row) => {
        return <div
          style={{
          }}
        >
          <input
            className="inputText"
            type="text"
            name='x'
            value={row.x}
            onChange={(e) => onChange(e, row.siteId)}
          />
        </div>
      },
    },
    {
      name: "Y",
      // selector: (row) => row.y,
      // sortable: true,
      width: '100px',
      cell: (row) => {
        return <div
          style={{
          }}
        >
          <input
            className="inputText"
            type="text"
            name='y'
            value={row.y}
            onChange={(e) => onChange(e, row.siteId)}
          />
        </div>
      }
    },
    {
      name: "Width",
      // selector: (row) => row.width,
      // sortable: true,
      width: '100px',
      cell: (row) => {
        return <div
          style={{
          }}
        >
          <input
            className="inputText"
            type="text"
            name='width'
            value={row.width}
            onChange={(e) => onChange(e, row.siteId)}
          />
        </div>
      }
    },
    {
      name: "Height",
      // selector: (row) => row.height,
      // sortable: true,
      width: '100px',
      cell: (row) => {
        return <div
          style={{
          }}
        >
          <input
            className="inputText"
            type="text"
            name='height'
            value={row.height}
            onChange={(e) => onChange(e, row.siteId)}
          />
        </div>
      }
    },
    {
      name: "COR HTML PADRÃO",
      selector: (row) => row.fetchedColor,
      width: '100px',
      center: 'true',
      compact: 'true',
      cell: (row) => {
        return <span
          style={{
            width: '40px',
            height: '40px',
            border: '1px solid gray',
            backgroundColor: `${row.fetchedColor ?? ''}`,
          }}
        >
        </span>
      },
      // sortable: true,
    },
    {
      name: "Time Update",
      selector: (row) => row.diffSec,
      width: '120px',
      center: 'true',
      compact: 'true',
      cell: (row) => {
        return <span>{row.diffSec}</span>
      },
      // sortable: true,
    },
    {
      name: "Action",
      // selector: (row) => row.isOpen,
      width: '100px',
      cell: (row) => {
        return <div>
          <button
            className={`btnToogleOn ${row.isOpen ? 'btnOff' : ''} ${row.isLoading ? 'btnDisabled' : ''}`}
            onClick={() => onToggleItem(row.siteId)}
            disabled={row.isLoading}
          >
            {row.isOpen ? 'Turn Off' : 'Turn On'}
          </button>
          <button
            className="btnRemove"
            onClick={() => onRemoveItem(row.siteId)}
          >X</button>
        </div>
      },
      ignoreRowClick: 'true',
      button: 'true',
      sortable: true,
    },
  ]
  return <div className="tblcontainer">
    <DataTable
      className="datatable"
      columns={columns}
      data={rows}
      fixedHeader
      fixedHeaderScrollHeight="60vh"
    />
  </div>
}