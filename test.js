// ViewPDF.js
import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import axios from 'axios';

const ViewPDF = ({ filename }) => {
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axios.get(`/pdf/${filename}`, {
          responseType: 'blob', // Important
        });
        setPdf(URL.createObjectURL(response.data));
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPdf();
  }, [filename]);

  return (
    <div>
      {pdf ? (
        <Document file={pdf}>
          <Page pageNumber={1} />
        </Document>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default ViewPDF;
