import React, { Component } from 'react';
import { ConfigContainer } from '../../styles/ConfigContainer';
import {
  Header, LoadingContainer, SelectText, selectStyle
} from '../../styles/global';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Creators as CourseActions } from '../../store/ducks/course';
import { actions as toastrActions } from 'react-redux-toastr';
import { Creators as IndicatorActions } from '../../store/ducks/indicator';
import { Creators as SubjectActions } from '../../store/ducks/subject';
import { Creators as SemesterActions } from '../../store/ducks/semester';
import { Creators as PhenomenonActions } from '../../store/ducks/phenomenon';
import { Creators as PredictionActions } from '../../store/ducks/prediction';
import { Creators as StudentActions } from '../../store/ducks/student';
import { Creators as PeriodActions } from '../../store/ducks/period';

import { LeftContent, SelectContainer, Content, Separator, GraphContainer, FlexItem, TabsContainer, ExternalLoadingContainer } from './styles';
import Select from 'react-select';
import Button from '../../styles/Button';

import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Plot from 'react-plotly.js';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

class Dashboard extends Component {
  state = {
    tabValue: 0,
    config: {
      responsive: true
    },
    isResultShown: false,
    // pieChartData: {
    //   values: [19, 26, 73],
    //   labels: ['Option 1', 'Option 2', 'Option 3'],
    //   type: 'pie'
    // },
    // pieChartLayout: {
    //   title: 'LAD Pie Chart',
    // },
    // barChartData: {
    //   x: ['giraffes', 'orangutans', 'monkeys'],
    //   y: [20, 14, 23],
    //   type: 'bar'
    // },
    // barChartLayout: {
    //   title: 'LAD Bar Chart',
    // },
    // bubbleChartData: {
    //   x: [1, 2, 3, 4],
    //   y: [10, 11, 12, 13],
    //   mode: 'markers',
    //   marker: {
    //       size: [40, 60, 80, 100]
    //   }
    // },
    // bubbleChartlayout: {
    //   title: 'Bubble Chart',
    //   showlegend: false,
    // },
  }

  componentDidMount() {
    this.props.indicatorInitFilter();
    this.props.predictionInit();
    this.props.getPhenomenon();
    this.props.getCourses({ datasource: 'moodle' });
  }

  showNavbar() {
    this.setState({isResultShown: !this.state.isResultShown});
  }

  handleChange = (item, name) => {
    this.props.setIndicator(name, item);
    this.refreshFilters(name, item);
  };

  refreshFilters = (name, item) => {
    // const { phenomenonSelected, courseSelected, subjectSelected, semesterSelected, periodSelected, studentSelected } = this.props.indicator;

    if (name === 'courseSelected') {

      if (!item || !item.length) {
        this.props.subjectSuccess([]);
        this.props.semesterSuccess([]);
        return;
      }

      this.props.getSubjects({ courses: item.map(item => item.value) });
    }

    if (name === 'subjectSelected') {
      if (!item || !item.length) {
        this.props.semesterSuccess([]);
        this.props.studentSuccess([]);
        return;
      }

      this.props.getSemesters({ subjects: item.map(item => item.value) });
      // this.props.getPeriods({ subjects: item.map(item => item.value) });
      this.props.getStudents({ subjects: item.map(item => item.value) });
    }

    if (name === 'semesterSelected') {
      const { subjectSelected } = this.props.indicator;

      let subjects, semesters;

      if ((!item || !item.length) && (!subjectSelected || !subjectSelected.length)) {
        this.props.periodSuccess([]);
        this.props.studentSuccess([]);
        return;
      } 
        
      if (item && item.length) {
        semesters = item.map(item => item.value);
      }

      if (subjectSelected && subjectSelected.length) {
        subjects = subjectSelected.map(item => item.value);
      }

      // this.props.getPeriods({ 
      //   subjects,
      //   semesters
      // });

      this.props.getStudents({
        subjects,
        semesters
      })
    }

    if (name === 'periodSelected') {
      const { subjectSelected, semesterSelected } = this.props.indicator;

      let subjects, semesters, periods;

      if ((!item || !item.length) && (!subjectSelected || !subjectSelected.length) && (!semesterSelected && !semesterSelected.length)) {
        this.props.studentSuccess([]);
        return;
      } 
        
      if (item && item.length) {
        periods = item.map(item => item.value);
      }

      if (subjectSelected && subjectSelected.length) {
        subjects = subjectSelected.map(item => item.value);
      }

      if (semesterSelected && semesterSelected.length) {
        semesters = semesterSelected.map(item => item.value);
      }

      this.props.getStudents({
        subjects,
        semesters,
        periods
      })
    }
  };

  renderWarningMsg = (msg) => {
    this.props.add({
      type: 'warning',
      title: 'Atenção',
      message: msg
    });
  }

  onSubmit = () => {
    let filter = {};
    const { phenomenonSelected, courseSelected, subjectSelected, semesterSelected, periodSelected, studentSelected } = this.props.indicator;

    if (!phenomenonSelected || !phenomenonSelected.label || !phenomenonSelected.value) {
      this.renderWarningMsg('Selecione um fenômeno educacional');
      return;
    }

    filter.phenomenon = phenomenonSelected.value;
    filter.courses = this.getValueFromSelect(courseSelected);
    filter.subjects = this.getValueFromSelect(subjectSelected);
    filter.semesters = this.getValueFromSelect(semesterSelected);
    filter.periods = this.getValueFromSelect(periodSelected);
    filter.students = this.getValueFromSelect(studentSelected);

    this.props.postPrediction(filter);
  }

  getValueFromSelect = items => {
    if (!items) {
      return null;
    }

    return items.map(item => item.value);
  }

  getBarChartDataDynamic = (predictionResult) => {
    let countZeros = 0;
    let countOnes = 0;

    predictionResult.forEach(binaryResult => {
      if (binaryResult === 0) {
        countZeros++;
      } else {
        countOnes++;
      }
    });

    const barChartDataDynamic = {
      x: ['Aprovados', 'Reprovados'],
      y: [countOnes, countZeros],
      marker:{
        color: ['green', 'red'],
      },
      type: 'bar'
    };

    return barChartDataDynamic;
  }

  getBarChartLayoutDynamic = () => {
    const barChartLayoutDynamic = {
      title: 'Desempenho Binário',
      width: 700, 
      height: 420,
    };

    return barChartLayoutDynamic;
  }

  getPieChartDataDynamic = (predictionResult) => {
    let countZeros = 0;
    let countOnes = 0;

    predictionResult.forEach(binaryResult => {
      if (binaryResult === 0) {
        countZeros++;
      } else {
        countOnes++;
      }
    });

    const pieChartDataDynamic = {
      values: [countOnes, countZeros],
      labels: ['Aprovados', 'Reprovados'],
      marker:{
        colors: ['green', 'red'],
      },
      type: 'pie',
    };

    return pieChartDataDynamic;
  }

  getPieChartLayoutDynamic = () => {
    const pieChartLayoutDynamic = {
      title: 'Desempenho Binário',
      width: 700, 
      height: 420,
    };

    return pieChartLayoutDynamic;
  }

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  render() {
    const { course, subject, semester, phenomenon, prediction, period, student } = this.props;
    const { courseSelected, subjectSelected, semesterSelected, phenomenonSelected, periodSelected, studentSelected } = this.props.indicator;
    const { 
      config,
      // pieChartData, pieChartLayout, 
      // barCharData, barChartLayout, bubbleChartData, bubbleChartlayout,
      tabValue
    } = this.state;

    return (
      <PerfectScrollbar style={{ width: '100%', overflowX: 'auto' }}>
        <ConfigContainer size='big' style={{ color: '#000' }}>

          <Header>
            <h1>Learning Analytics Dashboard</h1>
          </Header>

          <Content>

            <LeftContent>
              <SelectText>Fenômenos Educacionais</SelectText>
              <SelectContainer>
                <Select
                  isClearable
                  value={phenomenonSelected}
                  noOptionsMessage={() => 'Sem dados'}
                  onChange={(e) => this.handleChange(e, 'phenomenonSelected')}
                  placeholder={'Selecione os Fenômenos'}
                  styles={selectStyle}
                  options={phenomenon.data.asMutable()} />
              </SelectContainer>

              <SelectText>Cursos</SelectText>
              <SelectContainer>
                <Select
                  isMulti
                  isClearable
                  value={courseSelected}
                  noOptionsMessage={() => 'Sem dados'}
                  onChange={(e) => this.handleChange(e, 'courseSelected')}
                  placeholder={'Selecione os Cursos'}
                  styles={selectStyle}
                  options={course.data.asMutable()} />
              </SelectContainer>


              <SelectText>Disciplinas</SelectText>
              <SelectContainer>
                <Select
                  isMulti
                  isClearable
                  noOptionsMessage={() => 'Sem dados'}
                  value={subjectSelected}
                  onChange={(e) => this.handleChange(e, 'subjectSelected')}
                  placeholder={'Selecione as Disciplinas'}
                  styles={selectStyle}
                  options={subject.data.asMutable()} />
              </SelectContainer>


              <SelectText>Semestres</SelectText>
              <SelectContainer>
                <Select
                  isMulti
                  isClearable
                  value={semesterSelected}
                  noOptionsMessage={() => 'Sem dados'}
                  onChange={(e) => this.handleChange(e, 'semesterSelected')}
                  placeholder={'Selecione as Turmas'}
                  styles={selectStyle}
                  options={semester.data.asMutable()} />
              </SelectContainer>

              {/* <SelectText>Períodos</SelectText>
              <SelectContainer>
                <Select
                  isMulti
                  isClearable
                  value={periodSelected}
                  noOptionsMessage={() => 'Sem dados'}
                  onChange={(e) => this.handleChange(e, 'periodSelected')}
                  placeholder={'Selecione os Períodos'}
                  styles={selectStyle}
                  options={period.data.asMutable()} />
              </SelectContainer> */}

              <SelectText>Alunos</SelectText>
              <SelectContainer>
                <Select
                  isMulti
                  isClearable
                  value={studentSelected}
                  noOptionsMessage={() => 'Sem dados'}
                  onChange={(e) => this.handleChange(e, 'studentSelected')}
                  placeholder={'Selecione os Alunos'}
                  styles={selectStyle}
                  options={student.data.asMutable()} />
              </SelectContainer>

              <Button onClick={this.onSubmit.bind(this)}>Gerar Análise</Button>

            </LeftContent>
            
            {/* <Separator>&nbsp;</Separator> */}

            {prediction.data ?
              <TabsContainer>
                <Tabs
                  value={tabValue}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={this.handleTabChange}
                  centered
                >
                  <Tab label="Geral - Gráfico de barra" />
                  <Tab label="Geral - Gráfico de pizza" />
                  <Tab label="Por aluno" />
                </Tabs>

                {tabValue === 0 ?
                  <GraphContainer>
                    <FlexItem>
                      <Plot
                        data={[
                          this.getBarChartDataDynamic(prediction.data.data)
                        ]}
                        layout={
                          this.getBarChartLayoutDynamic(prediction.data.data)
                        }
                        config={config}
                        graphDiv="graph"
                      />
                    </FlexItem>
                  </GraphContainer>
                : null}

                {tabValue === 1 ?
                  <GraphContainer>
                    <FlexItem>
                      <Plot
                        data={[
                          this.getPieChartDataDynamic(prediction.data.data)
                        ]}
                        layout={
                          this.getPieChartLayoutDynamic(prediction.data.data)
                        }
                        config={config}
                        graphDiv="graph"
                      />
                    </FlexItem>
                  </GraphContainer>
                : null}
              </TabsContainer>
            : null}

            {/* <GraphContainer>
              <Plot
                data={[
                  this.getBubbleChartDataDynamic(prediction.data.data)
                ]}
                layout={
                  this.getBubbleChartlayoutDynamic(prediction.data.data)
                }
                config={config}
                graphDiv="graph"
              />
            </GraphContainer> */}

            {prediction.loading ?
              <ExternalLoadingContainer>
                <LoadingContainer>
                  <ProgressSpinner style={{ width: '70px', height: '70px' }} strokeWidth="4" fill="#EEEEEE" animationDuration=".5s" />
                </LoadingContainer>
              </ExternalLoadingContainer>
              : null}
            
          </Content>

          {/* {!data.length && !loading ?
            <StatusMsgContainer> Sem dados para serem exibidos. </StatusMsgContainer>
            : null} */}

        </ConfigContainer >
      </PerfectScrollbar>
    )
  }
}

const mapStateToProps = ({ course, indicator, subject, semester, phenomenon, prediction, period, student }) => ({ course, indicator, subject, semester, phenomenon, prediction, period, student});

export default connect(mapStateToProps,
  {
    ...toastrActions, ...CourseActions, 
    ...IndicatorActions, ...SemesterActions, 
    ...SubjectActions, ...PhenomenonActions,
    ...PredictionActions, ...StudentActions,
    ...PeriodActions
  })(Dashboard);