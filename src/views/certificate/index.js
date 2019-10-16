import React, { useState, useEffect } from 'react';
import history from '../../app/history';

import { Page, Image, Document, StyleSheet } from '@react-pdf/renderer';
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
export default function Certificate({ match, certificates }) {
  return (
    <Document>
      {!!certificates &&
        certificates.participants.map(participant => (
          <Page orientation="landscape" size="A5">
            {certificates.checkBackground && (
              <Image
                src={certificates.imgBackground}
                style={styles.pageBackground}
              />
            )}

            <ContentView
              flex={1}
              justify={certificates.layout_certificado.content_justify}
              align={certificates.layout_certificado.content_align}
            >
              <NameView margin={certificates.layout_certificado.name_margin}>
                <NameText
                  fontfamily={certificates.layout_certificado.name_font_family}
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
                  fontsize={certificates.layout_certificado.emission_font_size}
                >
                  {certificates.city} - {certificates.uf}, {certificates.date}
                </EmissionText>
              </EmissionDate>
            </ContentView>
          </Page>
        ))}
    </Document>
  );
}
