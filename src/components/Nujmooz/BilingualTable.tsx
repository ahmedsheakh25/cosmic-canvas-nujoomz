
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';

interface BilingualTableProps {
  data: {
    headers: string[];
    rows: string[][];
  };
  language: 'en' | 'ar';
  title?: string;
  className?: string;
}

const BilingualTable: React.FC<BilingualTableProps> = ({
  data,
  language,
  title,
  className = ''
}) => {
  const isRTL = language === 'ar';
  const textAlign = isRTL ? 'text-right' : 'text-left';
  const direction = isRTL ? 'rtl' : 'ltr';

  return (
    <Card className={`p-4 bg-nujmooz-surface border border-nujmooz-border ${className}`}>
      {title && (
        <h3 className={`text-lg font-semibold text-nujmooz-text-primary mb-4 ${textAlign} mixed-text`} dir={direction}>
          {title}
        </h3>
      )}
      
      <div className="overflow-x-auto" dir={direction}>
        <Table>
          <TableHeader>
            <TableRow className="border-nujmooz-border">
              {data.headers.map((header, index) => (
                <TableHead key={index} className={`text-nujmooz-text-secondary font-semibold ${textAlign} mixed-text`}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="border-nujmooz-border hover:bg-nujmooz-surface/50">
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className={`text-nujmooz-text-primary ${textAlign} mixed-text`}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default BilingualTable;
