/* users */

INSERT INTO "public"."users"("id","username","email","password","created_at","updated_at")
VALUES
(1,E'admin',E'admin@fmdev.com.br',E'$2b$12$w7eewDf60sZaaHyIkPmlx.4tMVydThjbSHXYsmT2/Vd20FqQu/oTm',E'2020-02-28 22:58:30.533848',E'2020-02-28 22:58:30.533848');

/* lms */

INSERT INTO "public"."lms"("created_at","updated_at","id","name","description","url","token","version")
VALUES
(E'2020-02-28 22:52:24.485502',E'2020-04-20 00:04:45.217821',1,E'moodle',E'Moodle',E'http://localhost:8080',E'laisdjvna032309',E'3.8.0'),
(E'2020-02-28 22:54:20.104673',E'2020-02-28 22:54:20.104673',2,E'chamilo',E'Chamilo',NULL,NULL,NULL),
(E'2020-02-28 22:54:48.524908',E'2020-02-28 22:54:48.524908',3,E'open_edx',E'Open EDX',NULL,NULL,NULL),
(E'2020-02-28 22:55:14.631368',E'2020-02-28 22:55:14.631368',4,E'totara_learn',E'Totara Learn',NULL,NULL,NULL);

/* indicators */

INSERT INTO "public"."indicators"("id","name","description","lms","created_at","updated_at")
VALUES
(1,E'curso',E'Curso',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(2,E'semestre',E'Semestre',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(3,E'período',E'Período',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(4,E'nome_da_disciplina',E'Nome da Disciplina',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(5,E'id_da_disciplina',E'ID da Disciplina',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(6,E'data_de_início',E'Data de Início',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(7,E'data_de_final',E'Data de Final',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(8,E'nome_do_aluno',E'Nome do Aluno',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(9,E'id_do_aluno',E'ID do Aluno',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(10,E'var01',E'VAR01',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(11,E'var02',E'VAR02',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(12,E'var03',E'VAR03',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(13,E'var04',E'VAR04',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(14,E'var05',E'VAR05',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(15,E'var06',E'VAR06',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(16,E'var07',E'VAR07',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(17,E'var08',E'VAR08',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(18,E'var09',E'VAR09',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(19,E'var10',E'VAR10',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(20,E'var12',E'VAR12',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(21,E'var13',E'VAR13',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(22,E'var14',E'VAR14',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(23,E'var15',E'VAR15',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(24,E'var16',E'VAR16',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(25,E'var17',E'VAR17',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(26,E'var18',E'VAR18',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(27,E'var19',E'VAR19',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(28,E'var20',E'VAR20',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(29,E'var21',E'VAR21',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(30,E'var22',E'VAR22',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(31,E'var23',E'VAR23',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(32,E'var24',E'VAR24',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(33,E'var25',E'VAR25',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(34,E'var28',E'VAR28',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(35,E'var29',E'VAR29',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(36,E'var30',E'VAR30',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(37,E'var31',E'VAR31',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(38,E'var31b',E'VAR31b',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(39,E'var31c',E'VAR31c',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(40,E'var32a',E'VAR32a',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(41,E'var32b',E'VAR32b',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(42,E'var32c',E'VAR32c',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(43,E'var32d',E'VAR32d',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(44,E'var33',E'VAR33',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(45,E'var34',E'VAR34',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(46,E'var35',E'VAR35',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(47,E'prova01',E'PROVA01',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(48,E'prova01_2chamada',E'PROVA01_2CHAMADA',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(49,E'primeira_prova',E'PRIMEIRA_PROVA',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(50,E'prova02',E'PROVA02',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(51,E'prova02_2chamada',E'PROVA02_2CHAMADA',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(52,E'segunda_prova',E'SEGUNDA_PROVA',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(53,E'media_provas',E'MEDIA_PROVAS',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(54,E'forum01',E'FORUM01',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(55,E'forum02',E'FORUM02',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(56,E'forum03',E'FORUM03',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(57,E'forum04',E'FORUM04',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(58,E'media_forum',E'MEDIA_FORUM',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(59,E'webquest01',E'WEBQUEST01',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(60,E'webquest02',E'WEBQUEST02',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(61,E'media_webquest',E'MEDIA_WEBQUEST',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(62,E'desempenho',E'DESEMPENHO',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(63,E'desempenho_binario',E'DESEMPENHO_BINARIO',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686'),
(64,E'desempenho_classes',E'DESEMPENHO_CLASSES',E'moodle',E'2020-02-28 23:23:24.435686',E'2020-02-28 23:23:24.435686');

/* Moodle Table */

CREATE TABLE moodle (
    curso character varying NOT NULL,
    semestre character varying NOT NULL,
    período character varying NOT NULL,
    nome_da_disciplina character varying NOT NULL,
    id_da_disciplina character varying NOT NULL,
    data_de_início character varying NOT NULL,
    data_de_final character varying NOT NULL,
    nome_do_aluno character varying NOT NULL,
    id_do_aluno character varying NOT NULL,
    var01 double precision NOT NULL,
    var02 double precision NOT NULL,
    var03 double precision NOT NULL,
    var04 double precision NOT NULL,
    var05 double precision NOT NULL,
    var06 double precision NOT NULL,
    var07 double precision NOT NULL,
    var08 double precision NOT NULL,
    var09 double precision NOT NULL,
    var10 double precision NOT NULL,
    var12 double precision NOT NULL,
    var13 double precision NOT NULL,
    var14 double precision NOT NULL,
    var15 double precision NOT NULL,
    var16 double precision NOT NULL,
    var17 double precision NOT NULL,
    var18 double precision NOT NULL,
    var19 double precision NOT NULL,
    var20 double precision NOT NULL,
    var21 double precision NOT NULL,
    var22 double precision NOT NULL,
    var23 double precision NOT NULL,
    var24 double precision NOT NULL,
    var25 double precision NOT NULL,
    var28 double precision NOT NULL,
    var29 double precision NOT NULL,
    var30 double precision NOT NULL,
    var31 double precision NOT NULL,
    var31b double precision NOT NULL,
    var31c double precision NOT NULL,
    var32a double precision NOT NULL,
    var32b double precision NOT NULL,
    var32c double precision NOT NULL,
    var32d double precision NOT NULL,
    var33 double precision NOT NULL,
    var34 double precision NOT NULL,
    var35 double precision NOT NULL,
    prova01 double precision NOT NULL,
    prova01_2chamada double precision NOT NULL,
    primeira_prova double precision NOT NULL,
    prova02 double precision NOT NULL,
    prova02_2chamada double precision NOT NULL,
    segunda_prova double precision NOT NULL,
    media_provas double precision NOT NULL,
    forum01 double precision NOT NULL,
    forum02 double precision NOT NULL,
    forum03 double precision NOT NULL,
    forum04 double precision NOT NULL,
    media_forum double precision NOT NULL,
    webquest01 double precision NOT NULL,
    webquest02 double precision NOT NULL,
    media_webquest double precision NOT NULL,
    desempenho double precision NOT NULL,
    desempenho_binario double precision NOT NULL,
    desempenho_classes character varying NOT NULL
);

/* O arquivo abaixo é pego do drive do grupo de pesquisa: Base de Dados - (Completa) Análise de Desempenho.csv */

COPY moodle FROM 'C:\basefmdev.csv' DELIMITER ';' CSV HEADER;