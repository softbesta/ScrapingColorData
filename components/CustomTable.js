"use client"
import DataTable from "react-data-table-component";
import Image from 'next/image'
import { useEffect, useState } from "react";

import dynamic from 'next/dynamic';
// import 'chart.js/auto';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// import {
//   Chart as ChartJS,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,

//   CategoryScale,
//   BarElement,
//   Title,
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

const CustomTable = ({
  rows,
  onChange,
  onToggleItem,
  onRemoveItem,
  onPickImageItem,
  maxSecond = 30,
  logData,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        // position: 'top',
      },
      title: {
        display: false,
        // text: 'Chart.js Bar Chart',
      },
    },
  };
  const labels = Array.from(Array(maxSecond).keys()).map(v => v + 1).slice(0, maxSecond);
  // const pointColors = ['#102321', '#f89102', '#17ef28', '#9e18f0', '#2032f3', '#102321', '#f89102', '#17ef28', '#9e18f0', '#2032f3', '#102321', '#f89102', '#17ef28', '#9e18f0', '#2032f3'].slice(-maxSecond)
  // const oddsData = [345, 290, 343, 123, 459, 345, 290, 343, 123, 459, 345, 290, 343, 123, 459, 345, 290, 343, 123, 459].slice(-maxSecond)
  // const data = {
  //   labels,
  //   datasets: [
  //     {
  //       // label: 'Dataset 1',
  //       data: oddsData,
  //       pointBackgroundColor: pointColors,
  //       pointRadius: 7,
  //       hoverRadius: 10,
  //     },
  //   ],
  // };

  // To avoid issue - Next.js warning for SSR
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const columns = [
    {
      name: "ID",
      // selector: (row) => row.siteId,
      // sortable: true,
      width: '38px',
      cell: (row) => {
        return <div className="InputBox inputText">
          {row.siteId}
        </div>
      },
      compact: 'true',
    },
    {
      name: "Action",
      // selector: (row) => row.isOpen,
      width: '115px',
      cell: (row) => {
        return <div className="actionBtns">
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
      compact: 'true',
      // sortable: true,
    },
    {
      name: "URL",
      // selector: (row) => row.url,
      // sortable: true,
      width: '200px',
      cell: (row) => {
        return <div className="InputBox inputText">
          <input
            type="text"
            name='url'
            value={row.url}
            onChange={(e) => onChange(e, row.siteId)}
          />
        </div>
      },
      compact: 'true',
    },
    {
      name: "Status",
      selector: (row) => row.isOpen.toString(),
      // sortable: true,
      width: '50px',
      compact: 'true',
      cell: (row) => {
        return hasMounted ? <div
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: `${row.isOpen ? 'green' : 'red'}`,
            borderRadius: 100,
          }}
        />
          :
          <div />
      },
    },
    {
      name: "X",
      // selector: (row) => row.x,
      // sortable: true,
      width: '70px',
      compact: 'true',
      cell: (row) => {
        return <div className="InputBox inputText">
          <input
            className="textRight"
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
      width: '70px',
      compact: 'true',
      cell: (row) => {
        return <div className="InputBox inputText">
          <input
            className="textRight"
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
      width: '70px',
      compact: 'true',
      cell: (row) => {
        return <div className="InputBox inputText">
          <input
            className="textRight"
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
      width: '70px',
      compact: 'true',
      cell: (row) => {
        return <div className="InputBox inputText">
          <input
            className="textRight"
            type="text"
            name='height'
            value={row.height}
            onChange={(e) => onChange(e, row.siteId)}
          />
        </div>
      }
    },
    {
      name: "Preview",
      // selector: (row) => row.imgUrl,
      width: '80px',
      center: 'true',
      compact: 'true',
      cell: (row) => {
        return hasMounted ? <div
          style={{
            width: '40px',
            height: '40px',
            border: '1px solid gray',
            backgroundImage: `url(${row.imgUrl ?? '/screenshots/screenshot2.png'})`,
            backgroundSize: '100% 100%',
          }}
          onClick={() => onPickImageItem(row.siteId)}
        />
          :
          <div />
      },
      // sortable: true,
    },
    // {
    //   name: "COR HTML PADRÃO",
    //   // selector: (row) => row.fetchedColor,
    //   width: '100px',
    //   center: 'true',
    //   compact: 'true',
    //   cell: (row) => {
    //     return hasMounted ? <div
    //       style={{
    //         width: '40px',
    //         height: '40px',
    //         border: '1px solid gray',
    //         backgroundColor: `${row.fetchedColor ?? ''}`,
    //       }}
    //     />
    //       :
    //       <div />
    //   },
    //   // sortable: true,
    // },
    // {
    //   name: "Time Updated",
    //   selector: (row) => row.diffSec,
    //   width: '70px',
    //   center: 'true',
    //   compact: 'true',
    //   cell: (row) => {
    //     return <div>{row.diffSec}</div>
    //   },
    //   // sortable: true,
    // },
    {
      name: "Realtime Status",
      selector: (row) => row.diffSec,
      // width: '100%',
      minWidth: '350px',
      center: 'true',
      compact: 'true',
      cell: (row) => {
        const logItem = (logData ?? []).find(log => log.siteId === row.siteId)
        const data = {
          labels,
          datasets: [
            {
              // label: 'Dataset 1',
              // data: oddsData,
              // pointBackgroundColor: pointColors,
              data: logItem?.odds ?? [],
              pointBackgroundColor: logItem?.colors ?? [],
              pointRadius: 7,
              hoverRadius: 10,
            },
          ],
        };
        return <div
          style={{
            width: '100%',
            height: 100,
          }}
        >
          <Line
            options={options}
            data={data}
          />
        </div>
      },
      // sortable: true,
    },
  ]
  return <div className="tblcontainer">
    <DataTable
      className="datatableConatiner"
      columns={columns}
      data={rows}
      fixedHeader
    // fixedHeaderScrollHeight="60vh"
    />
  </div>
}

export default CustomTable