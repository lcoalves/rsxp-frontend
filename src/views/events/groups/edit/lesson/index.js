import React, { useState, useEffect, Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Plyr from 'plyr';
import NumberFormat from 'react-number-format';
import history from '~/app/history';

import { toastr } from 'react-redux-toastr';
import { differenceInCalendarYears } from 'date-fns';

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
  const [presenceList, setPresenceList] = useState(null);

  const dispatch = useDispatch();
  const data = useSelector(state => state.lesson.data);

  function handleCheck(setFieldValue) {
    const participants = document.getElementsByClassName('childCheck').length;

    if (document.getElementById('checkAll').checked === true) {
      for (let index = 0; index < participants; index++) {
        document.getElementsByClassName('childCheck')[index].checked = true;
        setFieldValue(`selecteds.${index}.is_present`, true);
      }
    } else {
      for (let index = 0; index < participants; index++) {
        document.getElementsByClassName('childCheck')[index].checked = false;
        setFieldValue(`selecteds.${index}.is_present`, false);
      }
    }
  }

  function handleCheckChild(e, setFieldValue, id) {
    setFieldValue(`selecteds.${id}.is_present`, e.target.checked);
  }

  function handleSubmit(values) {
    let participants = [];

    !!!values.offer && (values.offer = 0);

    values.selecteds.map(selected => {
      participants.push({
        id: selected.id,
        is_present: selected.is_present,
      });
    });

    const payload = {
      lesson_report_id: data.id,
      date: new Date(),
      participants,
      offer: values.offer,
      testimony: values.testimony,
      doubts: values.doubts,
    };

    console.tron.log(payload);

    dispatch(LessonActions.editLessonRequest(payload));
  }

  function handleBackLessons() {
    toastr.confirm('As informações não serão salvas ao voltar.', {
      onOk: () =>
        history.push(`/eventos/grupo/${match.params.event_id}/editar`),
      onCancel: () => {},
    });
  }

  useEffect(() => {
    if (!!data.event && data.event.participants.length > 0) {
      let participants = [];

      data.event.participants.map(participant => {
        participants.push({
          id: participant.pivot.id,
          name: participant.name,
          birthday: participant.birthday,
          is_present: false,
        });
      });

      setPresenceList(participants);
    }
  }, [data]);

  useEffect(() => {
    const options = {};
    const player = new Plyr('#plyr-player', options);

    dispatch(LessonActions.lessonRequest(match.params.lesson_id));

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
      {!!data.lesson && (
        <Row>
          <Col xs="12">
            <Card className="white text-center p-4">
              <CardHeader className="p-0">
                <h1 className="black">{data.lesson.title}</h1>
                <p className="black">
                  <em>{data.lesson.description}</em>
                </p>
              </CardHeader>
              <CardBody className="d-flex flex-column justify-content-center align-items-center p-0">
                <Col xl="8" lg="7" md="12" xs="12" className="form-group">
                  {console.tron.log(data.lesson.video_id)}
                  <div
                    id="plyr-player"
                    data-plyr-provider="vimeo"
                    data-plyr-embed-id={data.lesson.video_id}
                  />
                </Col>
                <Formik
                  enableReinitialize
                  initialValues={{
                    selecteds: presenceList !== null ? presenceList : [],
                    offer: !!data.offer ? data.offer : '',
                    testimony: !!data.testimony ? data.testimony : '',
                    doubts: data.doubts,
                    // DATA FICTICIA DO FINAL DO EVENTO !!MUDAR QUANDO OS EVENTOS ESTIVEREM CRIADOS
                  }}
                  onSubmit={values => handleSubmit(values)}
                >
                  {({ values, setFieldValue }) => (
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
                              <th>Idade</th>
                            </tr>
                          </thead>
                          <tbody>
                            <FieldArray
                              name="selecteds"
                              render={arrayHelpers => (
                                <>
                                  {values.selecteds.map((selecteds, index) => (
                                    <tr
                                      className={`${!selecteds.is_present &&
                                        'table-danger'}`}
                                    >
                                      <td>
                                        <Field
                                          disabled={data.is_finished}
                                          type="checkbox"
                                          checked={selecteds.is_present}
                                          className="ml-0 childCheck"
                                          id={`selecteds.${index}.checked`}
                                          name={`selecteds.${index}.checked`}
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
                                        <Label>{selecteds.name}</Label>
                                      </td>
                                      <td>
                                        <Label>
                                          {differenceInCalendarYears(
                                            new Date(),
                                            new Date(selecteds.birthday)
                                          )}{' '}
                                          anos
                                        </Label>
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
