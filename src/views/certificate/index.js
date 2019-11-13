import React from 'react';

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
});

// Create Document Component
export default function Certificate({ certificates }) {
  return (
    <Document>
      <Page orientation="landscape" size="A5">
        {!!certificates &&
          certificates.participants &&
          certificates.participants.map((participant, index) => (
            <>
              {certificates.checkBackground && (
                <Image
                  src={certificates.imgBackground}
                  style={styles.pageBackground}
                />
              )}

              <ContentView
                key={index}
                flex={1}
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
            </>
          ))}
      </Page>
    </Document>
  );
}
