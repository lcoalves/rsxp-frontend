import React, { useState, useEffect } from 'react';
import history from '../../app/history';

import {
  Page,
  Image,
  Document,
  StyleSheet,
  PDFViewer,
} from '@react-pdf/renderer';
import {} from 'date-fns';

import {
  ContentView,
  NameView,
  NameText,
  EmissionDate,
  EmissionText,
} from './styles';

// Create styles
const styles = StyleSheet.create({
  pageBackground: {
    position: 'absolute',
    minWidth: '100%',
    minHeight: '100%',
    display: 'block',
    height: '100%',
    width: '100%',
  },
  participante: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emissao: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfview: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});

// Create Document Component
export default function Certificate({ match }) {
  const [certificates, setCertificates] = useState({});

  useEffect(() => {
    const storageCertificates = localStorage.getItem(
      '@dashboard/groupCertificate'
    );

    if (storageCertificates) {
      setCertificates(JSON.parse(storageCertificates));
    } else {
      alert('Você precisa gerar o certificado novamente!');
      history.push(`/eventos/grupo/${match.params.event_id}/editar`);
    }
  }, []);

  return (
    <PDFViewer style={styles.pdfview}>
      <Document>
        {!!certificates.date &&
          certificates.participants.map(participant => (
            <Page orientation="landscape" size="A5">
              {certificates.checkBackground && (
                <Image
                  src={
                    `http://` +
                    document.location.hostname +
                    `:3000/images/certificates/certificado_homem_ao_maximo.png`
                  }
                  style={styles.pageBackground}
                />
              )}

              <ContentView
                flex={certificates.layout_certificado.content_flex}
                justify={certificates.layout_certificado.content_justify}
                align={certificates.layout_certificado.content_align}
              >
                <NameView margin={certificates.layout_certificado.name_margin}>
                  <NameText
                    fontfamily={
                      certificates.layout_certificado.name_font_family
                    }
                    fontsize={certificates.layout_certificado.name_font_size}
                  >
                    {participant}
                  </NameText>
                </NameView>
                <EmissionDate
                  margin={certificates.layout_certificado.emission_margin}
                >
                  <EmissionText
                    fontfamily={
                      certificates.layout_certificado.emission_font_family
                    }
                    fontsize={
                      certificates.layout_certificado.emission_font_size
                    }
                  >
                    {certificates.city} - {certificates.uf}, {certificates.date}
                  </EmissionText>
                </EmissionDate>
              </ContentView>
            </Page>
          ))}
      </Document>
    </PDFViewer>
  );
}
