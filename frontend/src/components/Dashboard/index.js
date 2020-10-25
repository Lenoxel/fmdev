import React, { Component } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Header, LoadingContainer, SelectText, selectStyle
} from '../../styles/global';
import { connect } from 'react-redux';
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

import { LeftContent, SelectContainer, Content, HalfContent, CustomizedContent, GraphContainer, GraphContainerInside, FlexItem, TabsContainer, ExternalLoadingContainer, LeftContentInside, FlexInside, AsideContainer, MainContainer, DashboardMainContainer, FullContainer, ChipContainer, Item, CardContainer } from './styles';
import Select from 'react-select';
import Button from '../../styles/Button';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { Alert, AlertTitle } from '@material-ui/lab';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import MonitorIcon from 'react-feather/dist/icons/monitor';
import InfoIcon from 'react-feather/dist/icons/info';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';

// simplest method: uses precompiled complete bundle from `plotly.js`
// import Plot from 'react-plotly.js';

// import Plot from "react-plotly.js";
import Plotly from "plotly.js-basic-dist";

// customizable method: use your own `Plotly` object
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

// const useStyles = makeStyles((theme) => ({
//   button: {
//     margin: theme.spacing(1),
//   },
//   customWidth: {
//     maxWidth: 500,
//   },
//   noMaxWidth: {
//     maxWidth: 'none',
//   },
//   fixedFontSize: {
//     fontSize: '15px',
//   }
// }));

// const classes = useStyles();

class Dashboard extends Component {
  state = {
    tabValue: 0,
    config: {
      responsive: true,
      displaylogo: false,
      // scrollZoom: true,
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
      'var16': 'Número de atribuições/exercícios entregues pelo aluno após o prazo.',
      'var17': 'Tempo médio entre o momento em que uma atividade foi atribuída e em que o aluno a completou.',
      'var18': 'Número de vezes que o aluno acessa o fórum (pageviews)',
      'var20': 'Número de respostas em uma thread no fórum (denota a ação de reconsiderar a opinião sobre o assunto).',
      'var21': 'Número de vezes que o aluno acessa o relatório de notas.',
      'var22': 'Número de vezes que o aluno visualizou as atividades.',
      'var23': 'Número de visualizações nas notas de atividades.',
      'var24': 'Média semanal do número de vezes em que o aluno acessou o AVA.',
      'var25': 'Tempo médio entre o momento em que um tópico é criado no fórum e o momento\n em que o aluno posta sua primeira resposta nele.',
      'var28': 'Número de timeouts no AVA.',
      // 'var31a': 'Número de vezes que o aluno acessou o AVA.',
      'var31': 'Número de vezes que o aluno acessou o AVA.',
      'var31b': 'Número de distintos dias onde o aluno acessou o curso no AVA.',
      'var31c': 'Número de distintos dias onde o aluno acessou o AVA.',
      'var32a': 'Número de vezes em que o aluno acessou o AVA por período do dia (manhãs).',
      'var32b': 'Número de vezes em que o aluno acessou o AVA por período do dia (tardes).',
      'var32c': 'Número de vezes em que o aluno acessou o AVA por período do dia (fins de tardes).',
      'var32d': 'Número de vezes em que o aluno acessou o AVA por período do dia (noites).',
      'var33': 'Número de atividades/atribuições entregues por um aluno dentro do prazo.',
      'var34': 'Número total de mensagens postadas pelo aluno nos fóruns.',
      'var35': 'Número de respostas de um professor para perguntas do aluno em fóruns.',
    },
    chipSelected: 'overallView'
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
      this.props.setIndicator('subjectSelected', null);
      this.props.setIndicator('semesterSelected', null);
      this.props.setIndicator('studentSelected', null);
      this.props.subjectSuccess([]);
      this.props.semesterSuccess([]);
      this.props.studentSuccess([]);

      if (!item || !item.label || !item.value) {
        return;
      }

      this.props.getSubjects({ courses: [item.value] });

      // this.props.getSubjects({ courses: item.map(item => item.value) });
    }

    if (name === 'subjectSelected') {
      this.props.setIndicator('semesterSelected', null);
      this.props.setIndicator('studentSelected', null);
      this.props.studentSuccess([]);
      this.props.semesterSuccess([]);

      const { courseSelected } = this.props.indicator;

      let courses, subjects;

      if ((!item || !item.label || !item.value)) {
        return;
      }

      if (item && item.label && item.value) {
        subjects = [item.value];

        // subjects = item.map(item => item.value);
      }

      if (courseSelected && courseSelected.label && courseSelected.value) {
        courses = [courseSelected.value];

        // courses = courseSelected.map(item => item.value);
      }

      this.props.getSemesters({ 
        subjects,
        courses
      });

      this.props.getStudents({ 
        subjects,
        courses
      });
    }

    if (name === 'semesterSelected') {
      this.props.setIndicator('studentSelected', null);
      this.props.studentSuccess([]);

      const { courseSelected, subjectSelected } = this.props.indicator;

      let courses, subjects, semesters;

      if ((!item || !item.label || !item.value) && (!subjectSelected || !subjectSelected.label || !subjectSelected.value)) {
        return;
      } 
        
      if (item && item.label && item.value) {
        // semesters = item.map(item => item.value);
        semesters = [item.value];
      }

      if (courseSelected && courseSelected.label && courseSelected.value) {
        // courses = courseSelected.map(item => item.value);
        courses = [courseSelected.value];
      }

      if (subjectSelected && subjectSelected.label && subjectSelected.value) {
        // subjects = subjectSelected.map(item => item.value);
        subjects = [subjectSelected.value];
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

    // if (name === 'periodSelected') {
    //   const { subjectSelected, semesterSelected } = this.props.indicator;

    //   let subjects, semesters, periods;

    //   if ((!item || !item.length) && (!subjectSelected || !subjectSelected.length) && (!semesterSelected && !semesterSelected.length)) {
    //     this.props.studentSuccess([]);
    //     return;
    //   } 
        
    //   if (item && item.length) {
    //     periods = item.map(item => item.value);
    //   }

    //   if (subjectSelected && subjectSelected.length) {
    //     subjects = subjectSelected.map(item => item.value);
    //   }

    //   if (semesterSelected && semesterSelected.length) {
    //     semesters = semesterSelected.map(item => item.value);
    //   }

    //   this.props.getStudents({
    //     subjects,
    //     semesters,
    //     periods
    //   })
    // }
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
    filter.students = this.getValueFromIsMultiSelect(studentSelected);

    this.props.postPrediction(filter);

    this.setState({ 
      tabValue: 0,
      chipSelected: 'overallView',
      variableOptions: null,
      choosedVariable: null,
      studentOptions: null,
      choosedStudent: null,
      predictionInfoText: null,
    });
  }

  getValueFromSelect = item => {
    if (!item || !item.value) {
      return null;
    }

    return [item.value];
  }

  getValueFromIsMultiSelect = items => {
    if (!items || !items.length) {
      return null;
    }

    return items.map(item => item.value);
  }


  setChip = (value) => {
    if (value === 'overallView') {
      this.setState({
        chipSelected: value
      });
    } else if (value === 'studentsView') {
      const studentOptions = this.getStudentsDynamically();
      const variableOptions = this.getVariablesDynamically();

      const choosedStudent = studentOptions[0];
      const choosedVariable = [variableOptions[0]];

      this.setState({ 
        chipSelected: value,
        studentOptions,
        variableOptions,
        choosedStudent,
        choosedVariable,
      });

      this.handleVariableChange(choosedVariable);
      this.handleStudentChange(choosedStudent, choosedVariable);
    }
  }

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
    const { mappedVariablesMeaning } = this.state;

    let variableOptions = [
      {
      label: 'Todas',
      value: 'Todas'
      }
    ];

    if (prediction && prediction.data && prediction.data.realData) {
      const variables = Object.keys(prediction.data.realData[0]);

      variables.forEach(variable => {
        if (variable !== 'nome_do_aluno' && variable !== 'id_do_aluno') {
          const variableOption = {
            label: mappedVariablesMeaning[variable] || variable,
            value: variable,
          }
    
          variableOptions.push(variableOption);
        }
      });
    }

    return variableOptions;
  }

  handleTabChange = (newValue) => {
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

  handleDetailedChange = (event) => {
    if (event) {
      this.setState({ 
        choosedDetailed: event,
        choosedStudent: null,
        choosedVariable: null,
        predictionInfoText: null,
      });
    }
  }

  handleStudentChange = (event, choosedVariableFromInit) => {
    if (event && (event.value || event.length)) {
      const { 
        choosedVariable, choosedDetailed
      } = this.state;
      
      if (choosedVariable || choosedVariableFromInit) {
        this.setState({
          loadingChart: true,
        });

        if (choosedDetailed.value === 'byStudent') {
          this.makeDetailedChartByStudent(event, 'changingStudent', choosedVariableFromInit);
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

  handleVariableChange = (event) => {
    if (event && (event.value || event.length)) {
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

  makeDetailedChartByStudent = (choosedDontKnow, changingWhat, choosedVariableFromInit) => {
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
      updatedChoosedVariables = choosedVariable ? choosedVariable : choosedVariableFromInit;
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

    if (updatedChoosedVariables[updatedChoosedVariables.length-1].value === 'Todas') {
      let variableOptions = this.getVariablesDynamically();
      variableOptions.shift();
      updatedChoosedVariables = variableOptions;
      if (changingWhat === 'changingVariable') {
        choosedDontKnow = variableOptions;
      }
    } else if (updatedChoosedVariables[0].value === 'Todas' && updatedChoosedVariables.length > 1) {
      updatedChoosedVariables.shift();
      if (changingWhat === 'changingVariable') {
        choosedDontKnow = updatedChoosedVariables;
      }
    }

    for (const [index, variableName] of variableNames.entries()) {
      const searchedVariableOption = updatedChoosedVariables.find(variableOption => variableOption.value === variableName);

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
        color: 'rgb(74,81,115)'
      }
    };
    
    const detailedChartData = [chartInfo];

    const detailedChartLayout = {
      title: 'Indicadores do aluno x Média dos aprovados x Médias dos reprovados',
      width: 750, 
      height: 500,
      // font:{
      //   family: 'Raleway, sans-serif'  
      // },
      showlegend: false,
      xaxis: {
        title: 'Indicadores',
      },
      yaxis: {
        title: 'Valor do Indicador',
      },
      font: {
        family: 'Avenir, sans-serif',
        size: 14,
      },
      bargap: 0.05
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

    let xValueUniqueVariableName = allVariableNames.filter(variableName => variableName === updatedChoosedVariable.value);

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
      title: 'Análise preditiva de desempenho dos alunos',
      width: 1000, 
      height: 500,
    };

    const predictionInfoText = updatedChoosedVariable.value + ' - ' + updatedChoosedVariable.label;

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

  // handleChartChange = (event, value) => {
  //   if (event) {
  //     this.setState({ 
  //       choosedChart: event,
  //     });
  //   }
  // };

  // getDetailedChartDynamically = (choosedChart) => {
  //   const { prediction } = this.props;

  //   if (choosedChart.value === 'bar') {
  //     return this.getBarChartDataDynamic(prediction.data.predictedData);
  //   } else if (choosedChart.value === 'pie') {
  //     return this.getPieChartDataDynamic(prediction.data.predictedData);
  //   }
  // }

  getChartDataDynamically = (chartType) => {
    if (chartType === 'satisfactoryAndUnsatisfactory') {
      return this.getSatisfactoryAndUnsatisfactoryChartDataDynamic();
    } else if (chartType === 'allIndicatorsMean') {
      return this.getAllIndicatorsMeanChartDataDynamic();
    } else if (chartType === 'gradeAndForumAndWebquest') {
      return this.getGradeAndForumAndWebquestChartDataDynamic();
    }
  }

  getChartLayoutDynamically = (chartType) => {
    if (chartType === 'satisfactoryAndUnsatisfactory') {
      return this.getSatisfactoryAndUnsatisfactoryChartLayoutDynamic();
    } else if (chartType === 'allIndicatorsMean') {
      return this.getAllIndicatorsMeanChartLayoutDynamic();
    }
  }

  getGradeAndForumAndWebquestChartDataDynamic = () => {
    const { prediction } = this.props;

    let currentAssessments = prediction.data.assessmentVariables;

    let availableGrades = [];
    let availableGradeSizes = [];
    let availableGradeTexts = [];
    let availableForums = [];
    let availableWebquests = [];
    let studentPredictionResults = [];

    let satisfactoryWebquest = [];
    let unsatisfactoryWebquest = [];
    let satisfactoryForum = [];
    let unsatisfactoryForum = [];
    let satisfactoryGrade = [];
    let unsatisfactoryGrade = [];

    for (const [index, currentAssessment] of currentAssessments.entries()) {
      const studentPredictionResult = prediction.data.predictedData[index];
      
      if (studentPredictionResult === 0) {
        studentPredictionResults.push('red');
      } else if (studentPredictionResult === 1) {
        studentPredictionResults.push('green');
      }
      
      if (currentAssessment['media_webquest'] > 0) {
        availableWebquests.push(currentAssessment['media_webquest']);

        if (studentPredictionResult === 0) {
          unsatisfactoryWebquest.push(currentAssessment['media_webquest']);
        } else if (studentPredictionResult === 1) {
          satisfactoryWebquest.push(currentAssessment['media_webquest']);
        }
      } else if (currentAssessment['webquest01'] > 0) {
        availableWebquests.push(currentAssessment['webquest01']);

        if (studentPredictionResult === 0) {
          unsatisfactoryWebquest.push(currentAssessment['webquest01']);
        } else if (studentPredictionResult === 1) {
          satisfactoryWebquest.push(currentAssessment['webquest01']);
        }
      } else {
        availableWebquests.push(0);

        if (studentPredictionResult === 0) {
          unsatisfactoryWebquest.push(0);
        } else if (studentPredictionResult === 1) {
          satisfactoryWebquest.push(0);
        }
      }

      if (currentAssessment['media_forum'] > 0) {
        availableForums.push(currentAssessment['media_forum']);

        if (studentPredictionResult === 0) {
          unsatisfactoryForum.push(currentAssessment['media_forum']);
        } else if (studentPredictionResult === 1) {
          satisfactoryForum.push(currentAssessment['media_forum']);
        }
      } else if (currentAssessment['forum04'] > 0) {
        const currentForumMean = ((currentAssessment['forum04'] + currentAssessment['forum03'] + currentAssessment['forum02'] + currentAssessment['forum01']) / 4).toFixed(2);
        availableForums.push(currentForumMean);

        if (studentPredictionResult === 0) {
          unsatisfactoryForum.push(currentForumMean);
        } else if (studentPredictionResult === 1) {
          satisfactoryForum.push(currentForumMean);
        }
      } else if (currentAssessment['forum03'] > 0) {
        const currentForumMean = ((currentAssessment['forum03'] + currentAssessment['forum02'] + currentAssessment['forum01']) / 3).toFixed(2);
        availableForums.push(currentForumMean);

        if (studentPredictionResult === 0) {
          unsatisfactoryForum.push(currentForumMean);
        } else if (studentPredictionResult === 1) {
          satisfactoryForum.push(currentForumMean);
        }
      } else if (currentAssessment['forum02'] > 0) {
        const currentForumMean = ((currentAssessment['forum02'] + currentAssessment['forum01']) / 2).toFixed(2);
        availableForums.push(currentForumMean);
        
        if (studentPredictionResult === 0) {
          unsatisfactoryForum.push(currentForumMean);
        } else if (studentPredictionResult === 1) {
          satisfactoryForum.push(currentForumMean);
        }
      } else if (currentAssessment['forum01'] > 0) {
        const currentForumMean = currentAssessment['forum01'].toFixed(2);
        availableForums.push(currentForumMean);

        if (studentPredictionResult === 0) {
          unsatisfactoryForum.push(currentForumMean);
        } else if (studentPredictionResult === 1) {
          satisfactoryForum.push(currentForumMean);
        }
      } else {
        availableForums.push(0);

        if (studentPredictionResult === 0) {
          unsatisfactoryForum.push(0);
        } else if (studentPredictionResult === 1) {
          satisfactoryForum.push(0);
        }
      }

      if (currentAssessment['media_provas'] > 0) {
        availableGrades.push(currentAssessment['media_provas']);

        if (studentPredictionResult === 0) {
          unsatisfactoryGrade.push(currentAssessment['media_provas']);
        } else if (studentPredictionResult === 1) {
          satisfactoryGrade.push(currentAssessment['media_provas']);
        }
      } else if (currentAssessment['primeira_prova'] > 0) {
        availableGrades.push(currentAssessment['primeira_prova']);

        if (studentPredictionResult === 0) {
          unsatisfactoryGrade.push(currentAssessment['primeira_prova']);
        } else if (studentPredictionResult === 1) {
          satisfactoryGrade.push(currentAssessment['primeira_prova']);
        }
      } else {
        availableGrades.push(0);

        if (studentPredictionResult === 0) {
          unsatisfactoryGrade.push(0);
        } else if (studentPredictionResult === 1) {
          satisfactoryGrade.push(0);
        }
      }
    }

    const mappedMoreThenZeroWebquest = availableWebquests.filter(availableWebquest => availableWebquest > 0);
    const mappedMoreThenZeroForum = availableForums.filter(availableForum => availableForum > 0);
    const mappedMoreThenZeroGrades = availableGrades.filter(availableGrade => availableGrade > 0);

    if (mappedMoreThenZeroWebquest.length && mappedMoreThenZeroForum.length && mappedMoreThenZeroGrades.length) {
      availableGradeSizes = availableGrades.map(availableGrade => availableGrade * 10);

      availableGradeTexts = availableGrades.map((availableGrade, index) => {
        const currentStudentName = currentAssessments[index]['nome_do_aluno'];
        return `${currentStudentName}<br>Nota da prova: ${availableGrade}`;
      });

      const trace = {
        x: availableForums,
        y: availableWebquests,
        text: availableGradeTexts,
        mode: 'markers',
        marker: {
          color: studentPredictionResults,
          size: availableGradeSizes
        },
      };
      
      const data = [trace];

      const { config } = this.state;

      // config.modeBarButtonsToAdd = [
      //   {
      //     name: 'Tip button',
      //     icon: icon1,
      //     click: function(gd) {
      //       alert('Here comes the tip!');
      //     }
      //   },
      // ];

      return (
        <Content style={{ backgroundColor: 'white', borderRadius: '5px', width: '100%' }}>
          <Plot
            data={
              data
            }
            layout={
              this.getGradeAndForumAndWebquestChartDataLayout()
            }
            config={
              config
            }
            graphDiv='graph'
          />
        </Content>
      )
    } else if ((mappedMoreThenZeroWebquest.length && mappedMoreThenZeroForum.length) || (mappedMoreThenZeroWebquest.length && mappedMoreThenZeroGrades.length) || (mappedMoreThenZeroForum.length && mappedMoreThenZeroGrades.length)) {
      let data;
      let layout;
      let titleX;
      let titleY;

      if (mappedMoreThenZeroWebquest.length && mappedMoreThenZeroForum.length) {
        titleX = 'Nota do Fórum';
        titleY = 'Nota do Webquest';
        
        const minXaxis = Math.min(...availableForums);
        const maxXaxis =  Math.max(...availableForums);
        const minYaxis =  Math.min(...availableWebquests);
        const maxYaxis =  Math.max(...availableWebquests);

        data = this.makeScatterChart(satisfactoryWebquest, unsatisfactoryWebquest, satisfactoryForum, unsatisfactoryForum);
        layout = this.makeScatterLayout(titleX, minXaxis, maxXaxis, titleY, minYaxis, maxYaxis);
      } else if (mappedMoreThenZeroWebquest.length && mappedMoreThenZeroGrades.length) {
        titleX = 'Nota da Prova';
        titleY = 'Nota do Webquest';

        const minXaxis = Math.min(...availableGrades);
        const maxXaxis =  Math.max(...availableGrades);
        const minYaxis =  Math.min(...availableWebquests);
        const maxYaxis =  Math.max(...availableWebquests);

        data = this.makeScatterChart(satisfactoryWebquest, unsatisfactoryWebquest, satisfactoryGrade, unsatisfactoryGrade);
        layout = this.makeScatterLayout(titleX, minXaxis, maxXaxis, titleY, minYaxis, maxYaxis);
      } else if (mappedMoreThenZeroForum.length && mappedMoreThenZeroGrades.length) {
        titleX = 'Nota do Fórum';
        titleY = 'Nota da Prova';

        const minXaxis = Math.min(...availableForums);
        const maxXaxis =  Math.max(...availableForums);
        const minYaxis =  Math.min(...availableGrades);
        const maxYaxis =  Math.max(...availableGrades);

        data = this.makeScatterChart(satisfactoryGrade, unsatisfactoryGrade, satisfactoryForum, unsatisfactoryForum);
        layout = this.makeScatterLayout(titleX, minXaxis, maxXaxis, titleY, minYaxis, maxYaxis);
      }
      
      const { config } = this.state;

      return (
        <Content style={{ backgroundColor: 'white', borderRadius: '5px', width: '100%', textAlign: 'center' }}>
          <Plot
            data={
              data
            }
            layout={
              layout
            }
            config={
              config
            }
            graphDiv='graph'
          />
        </Content>
      )
    } else if (mappedMoreThenZeroWebquest.length || mappedMoreThenZeroForum.length || mappedMoreThenZeroGrades.length) {
      let data;
      let layout;
      let titleX;
      let titleY;

      if (mappedMoreThenZeroWebquest.length) {
        titleX = 'Nota do Webquest';
        titleY = 'Quantidade';

        data = this.makeHistogramChart(satisfactoryWebquest, unsatisfactoryWebquest);
        layout = this.makeHistogramLayout(titleX, titleY);
      } else if (mappedMoreThenZeroGrades.length) {
        titleX = 'Nota da Prova';
        titleY = 'Quantidade';

        data = this.makeHistogramChart(satisfactoryGrade, unsatisfactoryGrade);
        layout = this.makeHistogramLayout(titleX, titleY);
      } else if (mappedMoreThenZeroForum.length) {
        titleX = 'Nota da Prova';
        titleY = 'Quantidade';

        data = this.makeHistogramChart(satisfactoryForum, unsatisfactoryForum);
        layout = this.makeHistogramLayout(titleX, titleY);
      }
      
      const { config } = this.state;

      return (
        <Content style={{ backgroundColor: 'white', borderRadius: '5px', width: '100%', textAlign: 'center' }}>
          <Plot
            data={
              data
            }
            layout={
              layout
            }
            config={
              config
            }
            graphDiv='graph'
          />
        </Content>
      )
    } else {
      return;
    }
  }

  makeHistogramChart = (satisfactoryIndicator, unsatisfactoryIndicator) => {
    const firstTrace = {
      x: satisfactoryIndicator,
      type: 'histogram',
      opacity: 0.5,
      marker: {
        color: 'green',
      },
    };

    const secondTrace = {
      x: unsatisfactoryIndicator,
      type: 'histogram',
      opacity: 0.6,
      marker: {
        color: 'red',
      },
    };

    const data = [firstTrace, secondTrace];

    return data;
  }

  makeHistogramLayout = (titleX, titleY) => {
    const layout = {
      width: 1000, 
      height: 600,
      barmode: "overlay",
      xaxis: {
        title: titleX,
      },
      yaxis: {
        title: titleY,
      },
      title: 'Situação atual dos alunos',
      font: {
        family: 'Avenir, sans-serif',
        size: 14,
      },
    };

    return layout;
  }

  makeScatterChart = (satisfactoryY, unsatisfactoryY, satisfactoryX, unsatisfactoryX) => {
    const satisfactoryTrace = {
      x: satisfactoryX,
      y: satisfactoryY,
      mode: 'markers',
      type: 'scatter',
      name: 'Satisfatório',
      // text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
      marker: { 
        size: 12,
        color: 'green',
      },
    };
    
    const unsatisfactoryTrace = {
      x: unsatisfactoryX,
      y: unsatisfactoryY,
      mode: 'markers',
      type: 'scatter',
      name: 'Insatisfatório',
      // text: ['B-a', 'B-b', 'B-c', 'B-d', 'B-e'],
      marker: { 
        size: 12,
        color: 'red',
      },
    };
    
    const data = [satisfactoryTrace, unsatisfactoryTrace];

    return data;
  }

  makeScatterLayout = (titleX, minXaxis, maxXaxis, titleY, minYaxis, maxYaxis) => {
    const layout = {
      width: 1000, 
      height: 600,
      xaxis: {
        title: titleX,
        range: [minXaxis-0.2, maxXaxis+0.2],
      },
      yaxis: {
        title: titleY,
        range: [minYaxis-0.2, maxYaxis+0.2],
      },
      title: 'Situação atual dos alunos',
      font: {
        family: 'Avenir, sans-serif',
        size: 14,
      },
    };

    return layout;
  }

  getGradeAndForumAndWebquestChartDataLayout = () => {
    const bubbleChartLayoutDinamic = {
      title: 'Situação atual dos alunos',
      // autosize: false,
      // showlegend: false,
      width: 1000, 
      height: 600,
      font: {
        family: 'Avenir, sans-serif',
        size: 14,
      },
      xaxis: {
        title: 'Nota do Fórum',
      },
      yaxis: {
        title: 'Nota do Webquest',
      },
    };

    return bubbleChartLayoutDinamic;
  }

  getAllIndicatorsMeanChartDataDynamic = () => {
    const { prediction } = this.props;

    let indicators = prediction.data.indicators;

    let indicatorSatisfactoryMeans = [];
    let indicatorUnsatisfactoryMeans = [];

    for (const indicator of indicators) {
      let indicatorValueSatisfactorySum = 0;
      let satisfactoryCount = 0;
      let indicatorValueUnsatisfactorySum = 0;
      let unsatisfactoryCount = 0;

      for (const [index, uniqueRealData] of prediction.data.realData.entries()) {
        const choosedStudentVariablesLabelAndValue = Object.assign({}, uniqueRealData);
        
        const studentPredictionResult = prediction.data.predictedData[index];
        if (studentPredictionResult === 0) {
          indicatorValueUnsatisfactorySum += choosedStudentVariablesLabelAndValue[indicator];
          unsatisfactoryCount += 1;
        } else {
          indicatorValueSatisfactorySum += choosedStudentVariablesLabelAndValue[indicator];
          satisfactoryCount += 1;
        }
      }

      const indicatorSatisfactoryMean = satisfactoryCount > 0 ? (indicatorValueSatisfactorySum / satisfactoryCount).toFixed(2) : 0;
      indicatorSatisfactoryMeans.push(indicatorSatisfactoryMean);

      const indicatorUnatisfactoryMean = unsatisfactoryCount > 0 ? (indicatorValueUnsatisfactorySum / unsatisfactoryCount).toFixed(2) : 0;
      indicatorUnsatisfactoryMeans.push(indicatorUnatisfactoryMean);
    }

    const traceSatisfactory = {
      type: 'bar',
      x: indicatorSatisfactoryMeans,
      y: indicators,
      name: 'Satisfatório',
      marker: {
        color: 'green',
        width: 2
      },
      orientation: 'h',
    };

    const traceUnsatisfactory = {
      type: 'bar',
      x: indicatorUnsatisfactoryMeans,
      y: indicators,
      name: 'Insatisfatório',
      marker: {
        color: 'red',
        width: 2
      },
      orientation: 'h',
    };

    return [traceSatisfactory, traceUnsatisfactory];
  }

  getAllIndicatorsMeanChartLayoutDynamic = () => {
    const barChartLayoutDynamic = {
      title: 'Média dos indicadores dos alunos',
      autosize: false,
      width: 530, 
      height: 400,
      yaxis: {
        automargin: true,
      },
      font: {
        family: 'Avenir, sans-serif',
        size: 14,
      },
      barmode: 'stack',
    };

    return barChartLayoutDynamic;
  }

  getSatisfactoryAndUnsatisfactoryChartDataDynamic = () => {
    const { prediction } = this.props;

    let countZeros = prediction.data.countDisapproved;
    let countOnes = prediction.data.countApproved;

    const barChartDataDynamic = {
      x: ['Satisfatório', 'Insatisfatório'],
      y: [countOnes, countZeros],
      marker:{
        color: ['green', 'red'],
      },
      type: 'bar'
    };

    return [barChartDataDynamic];
  }

  getSatisfactoryAndUnsatisfactoryChartLayoutDynamic = () => {
    const barChartLayoutDynamic = {
      title: 'Análise preditiva de desempenho dos alunos',
      autosize: false,
      width: 530, 
      height: 400,
      yaxis: {
        automargin: true,
      },
      font: {
        family: 'Avenir, sans-serif',
        size: 14,  
      },
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
      labels: ['Satisfatório', 'Insatisfatório'],
      marker:{
        colors: ['green', 'red'],
      },
      type: 'pie',
    };

    return pieChartDataDynamic;
  }

  getPieChartLayoutDynamic = () => {
    const pieChartLayoutDynamic = {
      title: 'Análise preditiva de desempenho dos alunos',
      width: 800, 
      height: 500,
      font:{
        family: 'Avenir, sans-serif'  
      },
    };

    return pieChartLayoutDynamic;
  }

  renderIndicatorsMeaningTable = () => {
    const { prediction: { data: { indicators } } } = this.props;

    const { mappedVariablesMeaning } = this.state;

    return (
      <Table 
        // stickyHeader 
        aria-label="Indicators meaning table" 
        size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontFamily: 'Avenir, sans-serif', fontWeight: 'bold' }}>Indicador</TableCell>
            <TableCell style={{ fontFamily: 'Avenir, sans-serif', fontWeight: 'bold' }}>Significado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {indicators.map((indicator) => (
            <TableRow key={indicator}>
              <TableCell component="th" scope="row"  style={{ fontFamily: 'Avenir, sans-serif' }}>
                {indicator}
              </TableCell>
              <TableCell  style={{ fontFamily: 'Avenir, sans-serif' }}>{mappedVariablesMeaning[indicator]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  renderStudentCards= (choosedStudent, predictionInfoText) => {
    const { prediction } = this.props;

    let countZeros = prediction.data.countDisapproved;
    let countOnes = prediction.data.countApproved;
    
    return (
      <CardContainer style={{ display: 'flex', flexDirection: 'column', width: '30%', margin: '0 10px' }}>
        <Card variant="outlined" style={{ minWidth: '320px', marginBottom: '10px' }}>
          <Typography gutterBottom variant="h5" component="div" style={{ color: 'white', fontFamily: 'Avenir, sans-serif', backgroundColor: 'rgb(81, 201, 245)', minHeight: '50px', justifyContent: 'center', display: 'flex' }}>
            <span style={{ alignSelf: 'center' }}>Análise Preditiva</span>
          </Typography>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2" style={{ color: 'green', fontFamily: 'Avenir, sans-serif' }}>
              Desempenho satisfatório
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" style={{ color: 'green', fontFamily: 'Avenir, sans-serif', fontSize: '15px' }}>
              {predictionInfoText === 'Aprovado' ?
                <span><strong>{choosedStudent}</strong> + {countOnes-1} alunos</span>
              : <span>{countOnes} alunos</span>
              }
            </Typography>
            <hr style={{ margin: '10px 0 5px' }}></hr>
            <Typography gutterBottom variant="h5" component="h2" style={{ color: 'red', fontFamily: 'Avenir, sans-serif' }}>
              Desempenho insatisfatório
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" style={{ color: 'red', fontFamily: 'Avenir, sans-serif', fontSize: '15px' }}>
              {predictionInfoText === 'Reprovado' ?
                <span><strong>{choosedStudent}</strong> + {countZeros-1} alunos</span>
              : <span>{countZeros} alunos</span>
              }
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{ minWidth: '320px', marginBottom: '10px' }}>
          <Typography gutterBottom variant="h5" component="div" style={{ color: 'white', fontFamily: 'Avenir, sans-serif', backgroundColor: 'rgb(81, 201, 245)', minHeight: '50px', justifyContent: 'center', display: 'flex' }}>
            <span style={{ alignSelf: 'center' }}>Análise Descritiva</span>
          </Typography>
          <CardContent>
            <div style={{ border: '5px aliceblue', borderStyle: 'outset', borderRadius: '10px', padding: '5px' }}>
              <Typography gutterBottom variant="h5" component="h2" style={{ color: 'black', fontFamily: 'Avenir, sans-serif' }}>
                Notas do aluno
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" style={{ color: 'black', fontFamily: 'Avenir, sans-serif', fontSize: '15px' }}>
                Média de 2 notas: 5.5
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" style={{ color: 'black', fontFamily: 'Avenir, sans-serif', fontSize: '15px' }}>
                Média de 4 webquests: 2.0
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" style={{ color: 'black', fontFamily: 'Avenir, sans-serif', fontSize: '15px' }}>
                Média de 2 fóruns: 2.5
              </Typography>
            </div>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{ minWidth: '320px' }}>
          <Typography gutterBottom variant="h5" component="div" style={{ color: 'white', fontFamily: 'Avenir, sans-serif', backgroundColor: 'rgb(81, 201, 245)', minHeight: '50px', justifyContent: 'center', display: 'flex' }}>
            <span style={{ alignSelf: 'center' }}>Análise Descritiva</span>
          </Typography>
          <CardContent>
            <div style={{ border: '5px aliceblue', borderStyle: 'outset', borderRadius: '10px', padding: '5px' }}>
              <Typography gutterBottom variant="h5" component="h2" style={{ color: 'black', fontFamily: 'Avenir, sans-serif' }}>
                Média da turma
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" style={{ color: 'black', fontFamily: 'Avenir, sans-serif', fontSize: '15px' }}>
                Média de 2 notas: 3.7
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" style={{ color: 'black', fontFamily: 'Avenir, sans-serif', fontSize: '15px' }}>
                Média de 4 webquests: 1.0
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" style={{ color: 'black', fontFamily: 'Avenir, sans-serif', fontSize: '15px' }}>
                Média de 2 fóruns: 1.5
              </Typography>
            </div>
          </CardContent>
        </Card>
      </CardContainer>
    )
  } 

  render() {
    const { course, subject, semester, phenomenon, prediction, period, student } = this.props;
    const { courseSelected, subjectSelected, semesterSelected, phenomenonSelected, periodSelected, studentSelected,  } = this.props.indicator;
    const { 
      config, tabValue, chartOptions, choosedChart, studentOptions, choosedStudent, variableOptions, choosedVariable, detailedOptions, choosedDetailed, detailedChartData, detailedChartLayout, loadingChart, predictionInfoText, chipSelected,
    } = this.state;

    return (
      <PerfectScrollbar style={{ width: '100%', background: '#eaeff1'}}>
        <MainContainer>
          <AsideContainer>
            <LeftContent>
              <Header>
                <h1>Filtros</h1>
              </Header>

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
          </AsideContainer>

          {prediction.data ?
          <DashboardMainContainer>
            <div style={{ background: 'linear-gradient(-45deg, #0c9ed4 0%, #51c9f5 100%)' }}>
              <FullContainer>
                <Header style={{ padding: '10px 10px 0px' }}>
                  <MonitorIcon size={22} color={'white'} />
                  <h1 style={{ padding: '0px 0px 0px 12px' }}>Learning Analytics Dashboard</h1>
                  <div style={{ position: 'absolute', right: '0', marginTop: '6px' }}>
                    <Item
                      onClick={this.setChip.bind(this, 'overallView')}>
                      <InfoIcon size={22} color={'white'} />
                    </Item>
                  </div>
                </Header>
              </FullContainer>

              <FullContainer style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)' }}>
                <Header>
                  <div style={{ display: 'flex', paddingLeft: '10px' }}>
                    <div>
                      <Tooltip 
                        title="Veja o resumo das principais informações da análise gerada"
                        arrow
                        classes={{ tooltip: { fontSize: '15px' } }}>
                        <ChipContainer>
                          <Chip
                            label='Visão Geral'
                            className={chipSelected === 'overallView' ? 'active-chip-lad' : 'inactive-chip-lad'}
                            onClick={this.setChip.bind(this, 'overallView')}
                          />
                        </ChipContainer>
                      </Tooltip>
                    </div>
                    <div style={{ paddingLeft: '.5vw' }}>
                      <Tooltip 
                        title="Veja os detalhes da situação de cada aluno"
                        arrow>
                        <ChipContainer>
                          <Chip
                            label='Alunos'
                            className={chipSelected === 'studentsView' ? 'active-chip-lad' : 'inactive-chip-lad'}
                            variant="outlined"
                            onClick={this.setChip.bind(this, 'studentsView')}
                          />
                        </ChipContainer>
                      </Tooltip>
                    </div>
                    {/* <div style={{ paddingLeft: '.5vw' }}>
                      <Tooltip title="Veja as informações dos indicadores dos alunos no AVA" arrow>
                      <ChipContainer>
                        <Chip
                          label='Indicadores'
                          className={chipSelected === 'indicatorsView' ? 'active-chip-lad' : 'inactive-chip-lad'}
                          onClick={this.setChip.bind(this, 'indicatorsView')}
                        />
                      </ChipContainer>
                      </Tooltip>
                    </div> */}
                  </div>
                </Header>
              </FullContainer>
              {chipSelected === 'studentsView' ? 
              <div>
                <FullContainer>
                  <div style={{ width: '25%', margin: '5px 10px' }}>
                    <SelectText style={{ color: 'white',  fontFamily: 'Avenir, sans-serif', fontSize: '14px' }}>Aluno</SelectText>
                    <SelectContainer style={{ paddingBottom: '0px' }}>
                      <Select
                        value={choosedStudent}
                        onChange={this.handleStudentChange}
                        placeholder={'Selecione o aluno'}
                        styles={selectStyle}
                        options={studentOptions} />
                    </SelectContainer>
                  </div>
                  <div style={{ width: '75%', margin: '5px 10px' }}>
                    <SelectText style={{ color: 'white',  fontFamily: 'Avenir, sans-serif', fontSize: '14px' }}>Indicadores</SelectText>
                    <SelectContainer style={{ paddingBottom: '0px' }}>
                      <Select
                        isMulti
                        value={choosedVariable}
                        onChange={this.handleVariableChange}
                        placeholder={'Selecione os indicadores'}
                        styles={selectStyle}
                        options={variableOptions} />
                    </SelectContainer>
                  </div>
                </FullContainer>
              </div> : null}
            </div>

            {chipSelected === 'overallView' ? 
            <div>
              <FullContainer>
                <HalfContent style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Alert variant="filled" severity="success" style={{ textAlign: 'center' }}>
                    <AlertTitle>
                      <span style={{ fontStyle: 'normal', fontWeight: 'bold', fontFamily: 'Avenir, sans-serif' }}>
                        Desempenho Satisfatório
                      </span>
                    </AlertTitle>
                    <div style={{ fontStyle: 'normal', fontSize: '30px', fontWeight: 'bold', fontFamily: 'Avenir, sans-serif', marginTop: '12%' }}>
                      {prediction.data.percentageApproved} %
                    </div>
                  </Alert>

                  <Alert variant="filled" severity="error" style={{ textAlign: 'center' }}>
                    <AlertTitle>
                      <span style={{ fontStyle: 'normal', fontWeight: 'bold', fontFamily: 'Avenir, sans-serif' }}>
                        Desempenho Insatisfatório
                      </span>
                    </AlertTitle>
                    <div style={{ fontStyle: 'normal', fontSize: '30px', fontWeight: 'bold', fontFamily: 'Avenir, sans-serif', marginTop: '12%' }}>
                      {prediction.data.percentageDisapproved} %
                    </div>
                  </Alert>
                </HalfContent>

                <HalfContent>
                  <TableContainer component={Paper} style={{ maxHeight: '135px', borderRadius: '5px' }}>
                    {this.renderIndicatorsMeaningTable()}
                  </TableContainer>
                </HalfContent>
              </FullContainer>

              <FullContainer style={{ textAlign: 'center' }}>
                <HalfContent style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                  <Plot
                    data={
                      this.getChartDataDynamically('satisfactoryAndUnsatisfactory')
                    }
                    layout={
                      this.getChartLayoutDynamically('satisfactoryAndUnsatisfactory')
                    }
                    config={
                      config
                    }
                    graphDiv='graph'
                  />
                </HalfContent>

                <HalfContent style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                  <Plot
                    data={
                      this.getChartDataDynamically('allIndicatorsMean')
                    }
                    layout={
                      this.getChartLayoutDynamically('allIndicatorsMean')
                    }
                    config={
                      config
                    }
                    graphDiv='graph'
                  />
                </HalfContent>
              </FullContainer>

              <FullContainer style={{ textAlign: 'center' }}>
                {this.getChartDataDynamically('gradeAndForumAndWebquest')}
              </FullContainer>
            </div> : null}

            {chipSelected === 'studentsView' ? 
            <div style={{ width: '100%', display: 'flex', padding: '10px' }}>
              {choosedStudent && choosedVariable && !loadingChart ?
              <div style={{ width: '70%',  margin: '0 10px', textAlign: 'center', background: 'white' }}>
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
              </div>
              : null }
              {this.renderStudentCards(choosedStudent.label, predictionInfoText)}
            </div>
            : null}

            {/* {chipSelected === 'indicatorsView' ? 
            <div>
              <FullContainer>
                <HalfContent style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                  <Plot
                    data={
                      this.getChartDataDynamically('satisfactoryAndUnsatisfactory')
                    }
                    layout={
                      this.getChartLayoutDynamically('satisfactoryAndUnsatisfactory')
                    }
                    config={
                      config
                    }
                    graphDiv='graph'
                  />
                </HalfContent>

                <HalfContent style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                  <Plot
                    data={
                      this.getChartDataDynamically('satisfactoryAndUnsatisfactory')
                    }
                    layout={
                      this.getChartLayoutDynamically('satisfactoryAndUnsatisfactory')
                    }
                    config={
                      config
                    }
                    graphDiv='graph'
                  />
                </HalfContent>
              </FullContainer>
            </div> : null} */}

            {/* <Content>
              {prediction.data ?
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
            </Content> */}

            {/* <Content>
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
            </Content> */}
          </DashboardMainContainer>
          : null }

          {prediction.loading ?
          <ExternalLoadingContainer>
            <LoadingContainer>
              <ProgressSpinner style={{ width: '70px', height: '70px' }} strokeWidth="4" fill="#EEEEEE" animationDuration=".5s" />
            </LoadingContainer>
          </ExternalLoadingContainer>
          : null}
        </MainContainer>
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