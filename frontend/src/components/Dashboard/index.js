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

import { LeftContent, SelectContainer, Content, GraphContainer, GraphContainerInside, FlexItem, TabsContainer, ExternalLoadingContainer, LeftContentInside, FlexInside } from './styles';
import Select from 'react-select';
import Button from '../../styles/Button';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Alert from '@material-ui/lab/Alert';

// simplest method: uses precompiled complete bundle from `plotly.js`
// import Plot from 'react-plotly.js';

// import Plot from "react-plotly.js";
import Plotly from "plotly.js-basic-dist";

// customizable method: use your own `Plotly` object
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);


class Dashboard extends Component {
  state = {
    tabValue: 0,
    config: {
      responsive: true
    },
    chartOptions: [
      { value: 'bar', label: 'Barra' },
      { value: 'pie', label: 'Pizza' },
    ],
    choosedChart: { value: 'bar', label: 'Barra' },
    detailedOptions: [
      { value: 'byStudent', label: 'Aluno' },
      { value: 'byVariable', label: 'Variável' },
    ],
    choosedDetailed: { value: 'byStudent', label: 'Aluno' },
    variableOptions: null,
    choosedVariable: null,
    studentOptions: null,
    choosedStudent: null,
    detailedChartData: null,
    detailedChartLayout: null,
    loadingChart: false,
    predictionInfoText: null,
    mappedVariablesMeaning: {
      'var01': 'Número de diferentes lugares (Endereços IP) de onde o aluno acessou o AVA.',
      'var02': 'Número de mensagens enviadas do aluno ao(s) professor(es) usando o AVA.',
      'var03': 'Número de mensagens enviadas do aluno ao(s) tutor(es) usando o AVA.',
      'var04': 'Número total de mensagens enviadas pelo aluno no AVA.',
      'var05': 'Número total de mensagens recebidas pelo aluno no AVA.',
      'var06': 'Número de threads criadas pelo aluno em fóruns Q&A.',
      'var07': 'Número de threads no fórum Q&A.',
      'var08': 'Número de threads no fórum criadas pelo aluno que foram respondidas por outros alunos.',
      'var09': 'Número de threads no fórum criadas pelo aluno que foram respondidas pelo tutor ou professor.',
      'var10': 'Número de diferentes colegas para quem o aluno enviou mensagens no AVA.',
      'var12': 'Número de vezes que a seção "Conteúdos" (que lista os arquivos que descrevem o programa do curso) foi visualizada.',
      'var13': 'Hora do dia em que o aluno mais frequentemente trabalha em suas atribuições/exercícios.',
      'var14': 'Período do dia (manhã, tarde, anoitecer, noite) na qual o aluno mais frequentemente trabalhou em suas atribuições/exercícios.',
      'var16': 'Número de atribuições/exercícios entregues pelo aluno após o prazo, por curso.',
      'var17': 'Tempo médio entre o momento em que uma atividade foi atribuída e em que o aluno a completou.',
      'var18': 'Número de vezes que o aluno acessa o fórum (pageviews)',
      'var20': 'Número de respostas em uma thread no fórum (denota a ação de reconsiderar a opinião sobre o assunto).',
      'var21': 'Número de vezes que o aluno acessa o relatório de notas.',
      'var22': 'Número de vezes que o aluno visualizou as atividades.',
      'var23': 'Número de visualizações nas notas de atividades.',
      'var24': 'Média semanal do número de vezes em que o aluno acessou o AVA.',
      'var25': 'Tempo médio entre o momento em que um tópico é criado no fórum e o momento\n em que o aluno posta sua primeira resposta nele.',
      'var28': 'Número de timeouts de sessão.',
      // 'var31a': 'Número de vezes que o aluno acessou o AVA.',
      'var31': 'Número de vezes que o aluno acessou o AVA.',
      'var31b': 'Número de distintos dias onde o aluno acessou o curso no AVA.',
      'var31c': 'Número de distintos dias onde o aluno acessou o AVA.',
      'var32a': 'Número de vezes em que o aluno acessou o AVA por período do dia (manhãs).',
      'var32b': 'Número de vezes em que o aluno acessou o AVA por período do dia (tardes).',
      'var32c': 'Número de vezes em que o aluno acessou o AVA por período do dia ("anoiteceres").',
      'var32d': 'Número de vezes em que o aluno acessou o AVA por período do dia (noites).',
      'var33': 'Número de atividades/atribuições entregues por um aluno dentro do prazo, por curso.',
      'var34': 'Número total de mensagens postadas pelo aluno nos fóruns.',
      'var35': 'Número de respostas de um professor para perguntas do aluno em fóruns.',
    }
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

  refreshFilters = (name, item) => {
    // const { phenomenonSelected, courseSelected, subjectSelected, semesterSelected, periodSelected, studentSelected } = this.props.indicator;

    if (name === 'courseSelected') {

      if (!item || !item.length) {
        this.props.subjectSuccess([]);
        this.props.semesterSuccess([]);
        this.props.studentSuccess([]);
        return;
      }

      this.props.getSubjects({ courses: item.map(item => item.value) });
    }

    if (name === 'subjectSelected') {
      const { courseSelected } = this.props.indicator;

      let courses, subjects;

      if ((!item || !item.length)) {
        this.props.studentSuccess([]);
        this.props.semesterSuccess([]);
        return;
      }

      if (item && item.length) {
        subjects = item.map(item => item.value);
      }

      if (courseSelected && courseSelected.length) {
        courses = courseSelected.map(item => item.value);
      }

      this.props.getSemesters({ 
        subjects,
        courses
      });

      // this.props.getPeriods({ subjects: item.map(item => item.value) });

      this.props.getStudents({ 
        subjects,
        courses
      });
    }

    if (name === 'semesterSelected') {
      const { courseSelected, subjectSelected } = this.props.indicator;

      let courses, subjects, semesters;

      if ((!item || !item.length) && (!subjectSelected || !subjectSelected.length)) {
        // this.props.periodSuccess([]);
        this.props.studentSuccess([]);
        return;
      } 
        
      if (item && item.length) {
        semesters = item.map(item => item.value);
      }

      if (courseSelected && courseSelected.length) {
        courses = courseSelected.map(item => item.value);
      }

      if (subjectSelected && subjectSelected.length) {
        subjects = subjectSelected.map(item => item.value);
      }

      // this.props.getPeriods({ 
      //   subjects,
      //   semesters
      // });

      this.props.getStudents({
        courses,
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

    this.setState({ 
      tabValue: 0,
      variableOptions: null,
      choosedVariable: null,
      studentOptions: null,
      choosedStudent: null,
      predictionInfoText: null,
    });
  }

  getValueFromSelect = items => {
    if (!items) {
      return null;
    }

    return items.map(item => item.value);
  }

  handleTabChange = (event, newValue) => {
    if (newValue === 1) {
      const studentOptions = this.getStudentsDynamically();
      const variableOptions = this.getVariablesDynamically();

      this.setState({ 
        tabValue: newValue,
        studentOptions,
        variableOptions
      });
    } else if (newValue === 0) {
      this.setState({ tabValue: newValue });
    }
  };

  handleDetailedChange = (event, value) => {
    if (event) {
      this.setState({ 
        choosedDetailed: event,
        choosedStudent: null,
        choosedVariable: null,
        predictionInfoText: null,
      });
    }
  }

  handleStudentChange = (event, value) => {
    if (event) {
      const { 
        choosedVariable, choosedDetailed
      } = this.state;
      
      if (choosedVariable) {
        this.setState({
          loadingChart: true,
        });

        if (choosedDetailed.value === 'byStudent') {
          this.makeDetailedChartByStudent(event, 'changingStudent');
        } else if (choosedDetailed.value === 'byVariable') {
          this.makeDetailedChartByVariable(event, 'changingStudent');
        }
      } else {
        this.setState({ 
          choosedStudent: event,
          predictionInfoText: null,
        });
      }
    } else {
      this.setState({ 
        choosedStudent: event,
        predictionInfoText: null,
      });
    }
  }

  handleVariableChange = (event, value) => {
    if (event) {
      const { 
        choosedStudent, choosedDetailed
      } = this.state;
      
      if (choosedStudent) {
        this.setState({
          loadingChart: true,
        });
        
        if (choosedDetailed.value === 'byStudent') {
          this.makeDetailedChartByStudent(event, 'changingVariable');
        } else if (choosedDetailed.value === 'byVariable') {
          this.makeDetailedChartByVariable(event, 'changingVariable');
        }
      } else {
        this.setState({ 
          choosedVariable: event,
          predictionInfoText: null,
        });
      }
    } else {
      this.setState({ 
        choosedVariable: event,
        predictionInfoText: null,
      });
    }
  }

  makeDetailedChartByStudent = (choosedDontKnow, changingWhat) => {
    const { 
      choosedStudent, choosedVariable, mappedVariablesMeaning
    } = this.state;

    let updatedChoosedStudent;
    let updatedChoosedVariables;
    let predictionInfoText;
    let choosedStudentVariablesLabelAndValue;

    // Essa verificação é importantíssima, pois o estudante pode estar sendo modificado nesse exato momento, logo ele ainda não foi modificado no state.
    if (changingWhat === 'changingStudent') {
      updatedChoosedStudent = choosedDontKnow;
      updatedChoosedVariables = choosedVariable;
    } else {
      updatedChoosedStudent = choosedStudent;
      updatedChoosedVariables = choosedDontKnow;
    }

    const { prediction } = this.props;

    for (const [index, uniqueRealData] of prediction.data.realData.entries()) {
      if (uniqueRealData.id_do_aluno === updatedChoosedStudent.value) {
        choosedStudentVariablesLabelAndValue = Object.assign({}, uniqueRealData);
        const studentPredictionResult = prediction.data.predictedData[index];
        predictionInfoText = studentPredictionResult === 0 ? 'Reprovado' : 'Aprovado';
      }
    }

    // const choosedStudentVariablesLabelAndValue = prediction.data.realData.find(uniqueRealData => uniqueRealData.id_do_aluno === updatedChoosedStudent.value);

    let variableNames = Object.keys(choosedStudentVariablesLabelAndValue);
    let variableValues = Object.values(choosedStudentVariablesLabelAndValue);

    let xValueVariableNames = [];
    let yValueVariableValues = [];
    let textList = [];

    for (const [index, variableName] of variableNames.entries()) {
      const searchedVariableOption = updatedChoosedVariables.find(variableOption => variableOption.label === variableName);

      if (searchedVariableOption) {
        xValueVariableNames.push(variableName);
        textList.push(mappedVariablesMeaning[variableName]);
        yValueVariableValues.push(variableValues[index]);
      }
    }

    const chartInfo = {
      x: xValueVariableNames,
      y: yValueVariableValues,
      type: 'bar',
      text: textList,
      // textposition: 'auto',
      marker: {
        color: 'rgb(142,124,195)'
      }
    };
    
    const detailedChartData = [chartInfo];

    const detailedChartLayout = {
      title: 'Predição do Desempenho Binário por Aluno',
      width: 600, 
      height: 430,
      font:{
        family: 'Raleway, sans-serif'
      },
      showlegend: false,
      xaxis: {
        tickangle: -45
      },
      yaxis: {
        zeroline: false,
        gridwidth: 2
      },
      bargap :0.05
    };

    if (changingWhat === 'changingVariable') {
      this.setState({ 
        detailedChartData,
        detailedChartLayout,
        choosedVariable: choosedDontKnow,
        loadingChart: false,
        predictionInfoText
      });
    } else if (changingWhat === 'changingStudent') {
      this.setState({ 
        detailedChartData,
        detailedChartLayout,
        choosedStudent: choosedDontKnow,
        loadingChart: false,
        predictionInfoText
      });
    }
  }

  makeDetailedChartByVariable = (choosedDontKnow, changingWhat) => {
    const { 
      choosedStudent, studentOptions, choosedVariable, variableOptions, mappedVariablesMeaning
    } = this.state;

    let updatedChoosedStudents;
    let updatedChoosedVariable;
    let choosedStudentsInfo = [];

    // Essa verificação é importantíssima, pois a variável pode estar sendo modificada nesse exato momento, logo ela ainda não foi modificada no state.
    if (changingWhat === 'changingStudent') {
      updatedChoosedStudents = choosedDontKnow;
      updatedChoosedVariable = choosedVariable;
    } else {
      updatedChoosedStudents = choosedStudent;
      updatedChoosedVariable = choosedDontKnow;
    }

    const { prediction } = this.props;

    for (const student of updatedChoosedStudents) {
      for (const [index, uniqueRealData] of prediction.data.realData.entries()) {
        if (uniqueRealData.id_do_aluno === student.value) {
          let studentDataCopy = Object.assign({}, uniqueRealData);

          const studentPredictionResult = prediction.data.predictedData[index];
          studentDataCopy.binaryPrediction = studentPredictionResult;
          choosedStudentsInfo.push(studentDataCopy);
          
          break;
        }
      }
    }

    const allVariableNames = Object.keys(choosedStudentsInfo[0]);

    let xValueUniqueVariableName = allVariableNames.filter(variableName => variableName === updatedChoosedVariable.label);

    let traces = [];

    for (const choosedStudentInfo of choosedStudentsInfo) {
      const studentVariableValue = choosedStudentInfo[xValueUniqueVariableName[0]];
      let yValueStudentInfo = [studentVariableValue];

      const trace = {
        x: xValueUniqueVariableName,
        y: yValueStudentInfo,
        type: 'bar',
        name: choosedStudentInfo.binaryPrediction === 0 ? 'Reprovado' : 'Aprovado',
        text: choosedStudentInfo.nome_do_aluno,
        textposition: 'auto',
        // hoverinfo: 'none',
        marker: {
          color: choosedStudentInfo.binaryPrediction === 0 ? 'red' : 'green',
          line: {
            color: 'rgb(8,48,107)',
            width: 1.5
          }
        }
      };

      traces.push(trace);
    }

    const detailedChartData = traces;

    const detailedChartLayout = {
      title: 'Predição do Desempenho Binário por Variável',
      width: 600, 
      height: 430,
    };

    const predictionInfoText = updatedChoosedVariable.label + ' - ' + mappedVariablesMeaning[updatedChoosedVariable.label];

    if (changingWhat === 'changingVariable') {
      this.setState({ 
        detailedChartData,
        detailedChartLayout,
        choosedVariable: choosedDontKnow,
        loadingChart: false,
        predictionInfoText,
      });
    } else if (changingWhat === 'changingStudent') {
      this.setState({ 
        detailedChartData,
        detailedChartLayout,
        choosedStudent: choosedDontKnow,
        loadingChart: false,
        predictionInfoText,
      });
    }
  }

  // getRandomColor = () => {
  //   const x = Math.floor(Math.random() * 256);
  //   const y = Math.floor(Math.random() * 256);
  //   const z = Math.floor(Math.random() * 256);
  //   const bgColor = 'rgb(" + x + "," + y + "," + z + ")';

  //   return bgColor;
  // }

  getStudentsDynamically = () => {
    const { prediction } = this.props;

    let studentOptions = [];

    if (prediction && prediction.data && prediction.data.realData) {
      prediction.data.realData.forEach(uniqueData => {
        const studentOption = {
          label: uniqueData.nome_do_aluno,
          value: uniqueData.id_do_aluno,
        }
  
        studentOptions.push(studentOption);
      });
    }

    return studentOptions;
  }

  getVariablesDynamically = () => {
    const { prediction } = this.props;

    let variableOptions = [
      // {
      // label: 'Todas',
      // value: 'Todas'
      // }
    ];

    if (prediction && prediction.data && prediction.data.realData) {
      const variables = Object.keys(prediction.data.realData[0]);

      variables.forEach(variable => {
        if (variable !== 'nome_do_aluno' && variable !== 'id_do_aluno') {
          const variableOption = {
            label: variable,
            value: variable,
          }
    
          variableOptions.push(variableOption);
        }
      });
    }

    return variableOptions;
  }

  handleChartChange = (event, value) => {
    if (event) {
      this.setState({ 
        choosedChart: event,
      });
    }
  };

  getDetailedChartDynamically = () => {
    const { prediction } = this.props;

    const { choosedChart } = this.state;

    if (choosedChart.value === 'bar') {
      return this.getBarChartDataDynamic(prediction.data.predictedData);
    } else if (choosedChart.value === 'pie') {
      return this.getPieChartDataDynamic(prediction.data.predictedData);
    }
  }

  getChartDataDynamically = () => {
    const { prediction } = this.props;

    const { choosedChart } = this.state;

    if (choosedChart.value === 'bar') {
      return this.getBarChartDataDynamic(prediction.data.predictedData);
    } else if (choosedChart.value === 'pie') {
      return this.getPieChartDataDynamic(prediction.data.predictedData);
    }
  }

  getChartLayoutDynamically = () => {
    const { choosedChart } = this.state;

    if (choosedChart.value === 'bar') {
      return this.getBarChartLayoutDynamic();
    } else if (choosedChart.value === 'pie') {
      return this.getPieChartLayoutDynamic();
    }
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
      title: 'Predição do Desempenho Binário',
      width: 700, 
      height: 430,
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
      title: 'Predição do Desempenho Binário',
      width: 700, 
      height: 430,
    };

    return pieChartLayoutDynamic;
  }

  render() {
    const { course, subject, semester, phenomenon, prediction, period, student } = this.props;
    const { courseSelected, subjectSelected, semesterSelected, phenomenonSelected, periodSelected, studentSelected } = this.props.indicator;
    const { 
      config, tabValue, chartOptions, choosedChart, studentOptions, choosedStudent, variableOptions, choosedVariable, detailedOptions, choosedDetailed, detailedChartData, detailedChartLayout, loadingChart, predictionInfoText
    } = this.state;

    return (
      <PerfectScrollbar style={{ width: '100%', overflowX: 'auto' }}>
        <ConfigContainer size='big' style={{ color: '#000' }}>

          <Header>
            <h1>Learning Analytics Dashboard</h1>
          </Header>

          <Content>

            <LeftContent>
              {/* <SelectText>Fenômenos Educacionais</SelectText> */}
              <SelectText>Modelos Treinados</SelectText>
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
            
            {prediction.data ?
              <TabsContainer>
                <Tabs
                  value={tabValue}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={this.handleTabChange}
                  centered
                >
                  <Tab label="Geral" />
                  <Tab label="Detalhado" />
                </Tabs>

                {tabValue === 0 ?
                  <GraphContainer>
                    <FlexItem>
                      <SelectText>Gráfico</SelectText>
                        <SelectContainer>
                          <Select
                            value={choosedChart}
                            onChange={this.handleChartChange}
                            placeholder={'Selecione o tipo do gráfico'}
                            styles={selectStyle}
                            options={chartOptions} />
                        </SelectContainer>

                        <Plot
                          data={[
                            this.getChartDataDynamically()
                          ]}
                          layout={
                            this.getChartLayoutDynamically()
                          }
                          config={config}
                          graphDiv="graph"
                        />
                    </FlexItem>
                  </GraphContainer>
                : null}

                {tabValue === 1 ?
                  <FlexInside>
                    <LeftContentInside>
                      <SelectText>Detalhar por</SelectText>
                      <SelectContainer>
                        <Select
                          value={choosedDetailed}
                          onChange={this.handleDetailedChange}
                          styles={selectStyle}
                          options={detailedOptions} />
                      </SelectContainer>

                      {choosedDetailed.value === 'byStudent' ?
                        <div>
                          <SelectText>Aluno</SelectText>
                          <SelectContainer>
                            <Select
                              value={choosedStudent}
                              onChange={this.handleStudentChange}
                              placeholder={'Selecione o aluno'}
                              styles={selectStyle}
                              options={studentOptions} />
                          </SelectContainer>
      
                          <SelectText>Variáveis</SelectText>
                          <SelectContainer>
                            <Select
                              isMulti
                              isClearable
                              value={choosedVariable}
                              onChange={this.handleVariableChange}
                              placeholder={'Selecione as variáveis'}
                              styles={selectStyle}
                              options={variableOptions} />
                          </SelectContainer>
                          {predictionInfoText && predictionInfoText === 'Aprovado' ?
                              <Alert variant="outlined" severity="success">
                              Predição: Aprovado
                              </Alert>
                          : null}
                          {predictionInfoText && predictionInfoText === 'Reprovado' ?
                              <Alert variant="outlined" severity="error">
                              Predição: Reprovado
                              </Alert>
                          : null}
                        </div>
                      : null}

                      {choosedDetailed.value === 'byVariable' ?
                        <div>
                          <SelectText>Alunos</SelectText>
                          <SelectContainer>
                            <Select
                              isMulti
                              isClearable
                              value={choosedStudent}
                              onChange={this.handleStudentChange}
                              placeholder={'Selecione os alunos'}
                              styles={selectStyle}
                              options={studentOptions} />
                          </SelectContainer>
      
                          <SelectText>Variável</SelectText>
                          <SelectContainer>
                            <Select
                              value={choosedVariable}
                              onChange={this.handleVariableChange}
                              placeholder={'Selecione a variável'}
                              styles={selectStyle}
                              options={variableOptions} />
                          </SelectContainer>
                          {predictionInfoText ?
                              <Alert variant="outlined" severity="info">
                              {predictionInfoText}
                              </Alert>
                          : null}
                        </div>
                      : null}
                    </LeftContentInside>

                    {choosedStudent && choosedVariable && !loadingChart ?
                      <GraphContainerInside>
                        <FlexItem>
                          <Plot
                            data={
                              detailedChartData
                            }
                            layout={
                              detailedChartLayout
                            }
                            config={config}
                            graphDiv="graph"
                          />
                        </FlexItem>
                      </GraphContainerInside>
                    : null }
                  </FlexInside>
                : null}
              </TabsContainer>
            : null}

            {prediction.loading ?
              <ExternalLoadingContainer>
                <LoadingContainer>
                  <ProgressSpinner style={{ width: '70px', height: '70px' }} strokeWidth="4" fill="#EEEEEE" animationDuration=".5s" />
                </LoadingContainer>
              </ExternalLoadingContainer>
              : null}
            
          </Content>

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