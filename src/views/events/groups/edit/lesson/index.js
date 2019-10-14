import React, { useState, useEffect, Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Plyr from 'plyr';
import NumberFormat from 'react-number-format';
import history from '~/app/history';

import { Formik, Field, Form, FieldArray } from 'formik';

import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

import { Creators as LessonActions } from '../../../../../store/ducks/lesson';

class CurrencyFormat extends Component {
  state = {
    value: '',
  };

  render() {
    return (
      <NumberFormat
        inputMode="decimal"
        prefix={'R$ '}
        thousandSeparator="."
        decimalSeparator=","
        fixedDecimalScale
        decimalScale={2}
        allowNegative={false}
        defaultValue={0}
        value={this.state.currencyValue}
        onValueChange={vals => {
          this.setState({ value: vals.formattedValue });
        }}
        {...this.props}
      />
    );
  }
}

export default function Lesson({ match, className }) {
  const [modalBackLesson, setModalBackLesson] = useState(false);

  const dispatch = useDispatch();
  const data = useSelector(state => state.lesson.data);

  function handleCheck(setFieldValue) {
    const participants = document.getElementsByClassName('childCheck').length;

    if (document.getElementById('checkAll').checked === true) {
      for (let index = 0; index < participants; index++) {
        document.getElementsByClassName('childCheck')[index].checked = true;
        setFieldValue(`selected.${index}.is_present`, true);
      }
    } else {
      for (let index = 0; index < participants; index++) {
        document.getElementsByClassName('childCheck')[index].checked = false;
        setFieldValue(`selected.${index}.is_present`, false);
      }
    }
  }

  function handleCheckChild(e, setFieldValue, id) {
    setFieldValue(`selected.${id}.is_present`, e.target.checked);
  }

  function handleSubmit(values) {
    !!!values.offer && (values.offer = 0);
  }

  function handleBackLessons() {
    setModalBackLesson(true);
  }

  function confirmBackLessons() {
    history.push(`/eventos/grupo/${match.params.event_id}/editar`);
  }

  function cancelBackLessons() {
    setModalBackLesson(false);
  }

  useEffect(() => {
    dispatch(LessonActions.lessonRequest(match.params.lesson_id));

    const options = {};
    const player = new Plyr('#plyr-player', options);

    return () => {
      if (player.length > 0) {
        for (const playerEl of player) {
          playerEl.destroy();
        }
      }
    };
  }, []);

  return (
    <>
      {!!data && (
        <Row>
          <Col xs="12">
            <Card className="white text-center p-4">
              <CardHeader className="p-0">
                <h1 className="black">{data.name}</h1>
                <p className="black">
                  <em>{data.description}</em>
                </p>
              </CardHeader>
              <CardBody className="d-flex flex-column justify-content-center align-items-center p-0">
                <Col xl="8" lg="7" md="12" xs="12" className="form-group">
                  <div
                    id="plyr-player"
                    data-plyr-provider="vimeo"
                    data-plyr-embed-id="127186403"
                  />
                </Col>
                <Formik
                  enableReinitialize
                  initialValues={{
                    selected: !!data.participants ? data.participants : [],
                    offer: !!data.offer ? data.offer : '',
                    testimony: !!data.testimony ? data.testimony : '',
                    doubts: data.doubts,
                    // DATA FICTICIA DO FINAL DO EVENTO !!MUDAR QUANDO OS EVENTOS ESTIVEREM CRIADOS
                  }}
                  onSubmit={values => handleSubmit(values)}
                >
                  {({
                    errors,
                    touched,
                    handleChange,
                    values,
                    setFieldValue,
                  }) => (
                    <Form className="w-100 d-flex flex-column justify-content-center align-items-center">
                      <Col lg="8" md="12" xs="12">
                        <h2 className="black mt-4">Presença</h2>
                        <h6 className="black">
                          <em>Marque os participantes presentes</em>
                        </h6>
                        {/* <TablePresence data={} /> */}
                        <Table>
                          <thead>
                            <tr>
                              <th>
                                <Field
                                  disabled={data.is_finished}
                                  type="checkbox"
                                  className="ml-0"
                                  id="checkAll"
                                  onClick={() => handleCheck(setFieldValue)}
                                />
                                <Label for="checkAll" className="pl-3">
                                  Todos
                                </Label>
                              </th>
                              <th>Participantes</th>
                            </tr>
                          </thead>
                          <tbody>
                            <FieldArray
                              name="selected"
                              render={arrayHelpers => (
                                <>
                                  {values.selected.map((selected, index) => (
                                    <tr
                                      className={`${!selected.is_present &&
                                        'table-danger'}`}
                                    >
                                      <td>
                                        <Field
                                          disabled={data.is_finished}
                                          type="checkbox"
                                          checked={selected.is_present}
                                          className="ml-0 childCheck"
                                          id={`selected.${index}.checked`}
                                          name={`selected.${index}.checked`}
                                          onClick={e =>
                                            handleCheckChild(
                                              e,
                                              setFieldValue,
                                              index
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <Label>{selected.name}</Label>
                                      </td>
                                    </tr>
                                  ))}
                                </>
                              )}
                            />
                          </tbody>
                        </Table>
                      </Col>

                      <Col lg="4" md="12" xs="12">
                        <h2 className="black mt-4">Oferta</h2>
                        <CurrencyFormat
                          disabled={data.is_finished}
                          id="offer"
                          name="offer"
                          className="form-control"
                          value={values.offer}
                          onValueChange={val =>
                            setFieldValue('offer', val.floatValue)
                          }
                        />
                      </Col>

                      <Col lg="8" md="12" xs="12">
                        <h2 className="black mt-4">Testemunho</h2>
                        <Field
                          component="textarea"
                          disabled={data.is_finished}
                          type="textarea"
                          id="testimony"
                          rows="5"
                          name="testimony"
                          className="form-control"
                          style={{
                            minHeight: '70px',
                            maxHeight: '350px',
                          }}
                        />
                      </Col>
                      <Col lg="8" md="12" xs="12">
                        <h2 className="black mt-4">Dúvidas</h2>
                        <Field
                          component="textarea"
                          disabled={data.is_finished}
                          type="textarea"
                          id="doubts"
                          rows="5"
                          name="doubts"
                          className="form-control"
                          style={{
                            minHeight: '70px',
                            maxHeight: '350px',
                          }}
                        />
                      </Col>

                      <Col>
                        <Button
                          className="mt-4 mr-2"
                          outline
                          color="warning"
                          onClick={handleBackLessons}
                        >
                          Voltar
                        </Button>
                        <Button
                          disabled={data.is_finished}
                          className={`mt-4 ${data.is_finished &&
                            'cursor-not-allowed'}`}
                          type="submit"
                          color="success"
                        >
                          Confirmar relatório
                        </Button>
                      </Col>

                      <Modal
                        isOpen={modalBackLesson}
                        toggle={cancelBackLessons}
                        className={className}
                      >
                        <ModalHeader toggle={cancelBackLessons}>
                          Voltar para as aulas
                        </ModalHeader>
                        <ModalBody>
                          <div>
                            As informações desta páginas não serão salvas ao
                            voltar
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Form>
                            <Button
                              className="ml-1 my-1"
                              outline
                              color="warning"
                              onClick={cancelBackLessons}
                            >
                              Cancelar
                            </Button>{' '}
                            <Button
                              className="ml-1 my-1"
                              color="success"
                              onClick={confirmBackLessons}
                            >
                              Confirmar
                            </Button>{' '}
                          </Form>
                        </ModalFooter>
                      </Modal>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}
