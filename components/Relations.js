const Relations = ({ values, onChange }) => {
  return (
    <div className="content">
      <table>
        <tr>
          <th>N°</th>
          <th>SITE</th>
          <th>TIME UPDATE</th>
          <th>COR</th>
        </tr>
        <tr>
          <td>01</td>
          <td><input type="text" id="report-site-1" value="KTO.PT" /></td>
          <td><input type="text" id="time-1" value="0,378s" /></td>
          <td><input type="text" id="report-color-1" value="#008000" /></td>
        </tr>
      </table>
    </div>
  )
};

export default Relations;