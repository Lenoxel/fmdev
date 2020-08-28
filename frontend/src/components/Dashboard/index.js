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
import { LeftContent, SelectContainer, Content, Separator, GraphContainer, FlexItem } from './styles';
import Select from 'react-select';
import Button from '../../styles/Button';

import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// Com o Plot importado aqui, transferir tudo que está em index.js e styles.js de PredictionChart para cá
import Plot from 'react-plotly.js';

class Dashboard extends Component {
  state = {
    tabValue: 0,
    pieChartData: {
      values: [19, 26, 73],
      labels: ['Option 1', 'Option 2', 'Option 3'],
      type: 'pie'
    },
    pieChartLayout: {
      title: 'LAD Pie Chart',
    },
    barChartData: {
      x: ['giraffes', 'orangutans', 'monkeys'],
      y: [20, 14, 23],
      type: 'bar'
    },
    barChartLayout: {
      title: 'LAD Bar Chart',
    },
    bubbleChartData: {
      x: [1, 2, 3, 4],
      y: [10, 11, 12, 13],
      mode: 'markers',
      marker: {
          size: [40, 60, 80, 100]
      }
    },
    bubbleChartlayout: {
      title: 'Bubble Chart',
      showlegend: false,
    },
    config: {
      responsive: true
    },
  }

  componentDidMount() {
    this.props.indicatorInitFilter();
    this.props.predictionInit();
    this.props.getPhenomenon();
    this.props.getCourses({ datasource: 'moodle' });
  }

  handleChange = (item, name) => {
    this.props.setIndicator(name, item);
    this.refreshFilters(name, item);
  };

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  refreshFilters = (name, item) => {
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
        return;
      }

      this.props.getSemesters({ subjects: item.map(item => item.value) });
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
    const { phenomenonSelected, courseSelected, subjectSelected, semesterSelected } = this.props.indicator;

    if (!phenomenonSelected) {
      this.renderWarningMsg('Selecione um fenômeno educacional');
      return;
    }

    filter.phenomenon = phenomenonSelected.value;
    filter.courses = this.getValueFromSelect(courseSelected);
    filter.subjects = this.getValueFromSelect(subjectSelected);
    filter.semesters = this.getValueFromSelect(semesterSelected);

    this.props.postPrediction(filter);
  }

  getValueFromSelect = items => {
    if (!items) {
      return null;
    }

    return items.map(item => item.value);
  }

  render() {
    // const data = [];
    const loading = false;
    const { course, subject, semester, phenomenon, prediction } = this.props;
    const { courseSelected, subjectSelected, semesterSelected, phenomenonSelected } = this.props.indicator;
    const { pieChartData, pieChartLayout, config,
      // barCharData, barChartLayout, bubbleChartData, bubbleChartlayout,
      tabValue
    } = this.state;

    let pieChartDataDynamic, pieChartLayoutDynamic, barChartDataDynamic, barChartLayoutDynamic;

    // Acredito que o ideal é não ter esse if, mas sempre retornar o prediction.data, do Predict.py, no formato correto para o Plot já pegar dele. Ver depois se é possível...
    if (prediction.data && prediction.data.data) {
      let countZeros = 0;
      let countOnes = 0;

      const predictionResult = prediction.data.data;
      
      predictionResult.forEach(binaryResult => {
        if (binaryResult === 0) {
          countZeros++;
        } else {
          countOnes++;
        }
      });

      barChartDataDynamic = {
        x: ['Aprovados', 'Reprovados'],
        y: [countOnes, countZeros],
        marker:{
          color: ['green', 'red'],
        },
        type: 'bar'
      };

      barChartLayoutDynamic = {
        title: 'Desempenho Binário',
      };

      pieChartDataDynamic = {
        values: [countOnes, countZeros],
        labels: ['Aprovados', 'Reprovados'],
        type: 'pie',
      };
        
      pieChartLayoutDynamic = {
        title: 'Desempenho Binário',
      };
    }

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


              <SelectText>Turmas</SelectText>
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

              <SelectText>Período</SelectText>
              <SelectContainer>
                <Select
                  isMulti
                  isClearable
                  value={semesterSelected}
                  noOptionsMessage={() => 'Sem dados'}
                  onChange={(e) => this.handleChange(e, 'semesterSelected')}
                  placeholder={'Selecione os Períodos'}
                  styles={selectStyle}
                  options={semester.data.asMutable()} />
              </SelectContainer>

              <Button onClick={this.onSubmit.bind(this)}>Gerar Análise</Button>

            </LeftContent>

            {/* <Separator>&nbsp;</Separator> */}

            {/* {prediction.data ?
              <Tabs
                value={tabValue}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleTabChange()}
                centered
              >
                <Tab label="Bar Chart" />
                <Tab label="Pie Chart" />
              </Tabs>
            : null} */}

            {/* {prediction.data ?
              <GraphContainer>
                <FlexItem>
                  <Plot
                    data={[
                      pieChartDataDynamic
                    ]}
                    layout={pieChartLayoutDynamic}
                    config={config}
                    graphDiv="graph"
                  />
                </FlexItem>
              </GraphContainer>
            : null} */}

            {prediction.data ?
              <GraphContainer>
                <FlexItem>
                  <Plot
                    data={[
                      barChartDataDynamic
                    ]}
                    layout={barChartLayoutDynamic}
                    config={config}
                    graphDiv="graph"
                  />
                </FlexItem>
              </GraphContainer>
            : null}

            {/* <GraphContainer>
              <Plot
                data={[
                  bubbleChartData
                ]}
                layout={bubbleChartlayout}
                config={config}
                graphDiv="graph"
              />
            </GraphContainer> */}

            {prediction.loading ?
              <GraphContainer>
                <LoadingContainer>
                  <ProgressSpinner style={{ width: '70px', height: '70px' }} strokeWidth="4" fill="#EEEEEE" animationDuration=".5s" />
                </LoadingContainer>
              </GraphContainer>
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

const mapStateToProps = ({ course, indicator, subject, semester, phenomenon, prediction }) => ({ course, indicator, subject, semester, phenomenon, prediction });

export default connect(mapStateToProps,
  {
    ...toastrActions, ...CourseActions, 
    ...IndicatorActions, ...SemesterActions, 
    ...SubjectActions, ...PhenomenonActions,
    ...PredictionActions
  })(Dashboard);