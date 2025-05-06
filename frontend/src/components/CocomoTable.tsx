import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  margin: 20px 0;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  
  th {
    background-color: #f8f9fa;
  }
  
  input {
    width: 100%;
    padding: 5px;
    border: none;
    text-align: center;
  }
`;

interface CocomoTableProps {
  mode: string;
  a: number;
  b: number;
  scedModified: number;
  rcpxModified: number;
  unadjustedFunctionality: number;
  unadjustedFunctionalityResult: number;
  onValueChange: (field: string, value: string) => void;
}

const CocomoTable: React.FC<CocomoTableProps> = ({
  mode,
  a,
  b,
  scedModified,
  rcpxModified,
  unadjustedFunctionality,
  unadjustedFunctionalityResult,
  onValueChange
}) => {
  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <th>SLDC</th>
            <th>a</th>
            <th>b</th>
            <th>SCED % Modified</th>
            <th>RCPX % Modified</th>
            <th>Unadjusted Functionality</th>
            <th>Unadusted Functionality</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                value={mode}
                onChange={(e) => onValueChange('mode', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={a}
                onChange={(e) => onValueChange('a', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={b}
                onChange={(e) => onValueChange('b', e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={scedModified}
                onChange={(e) => onValueChange('scedModified', e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={rcpxModified}
                onChange={(e) => onValueChange('rcpxModified', e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={unadjustedFunctionality}
                onChange={(e) => onValueChange('unadjustedFunctionality', e.target.value)}
              />
            </td>
            <td>{unadjustedFunctionalityResult}</td>
          </tr>
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default CocomoTable;