import json
import joblib
import traceback
import pandas as pd
from numpy import array
from utils import utils
from flask_restful import Resource
from flask import request, current_app
from resources.TrainModel import TrainModelResource


class Predict(Resource):

    def is_api_key_valid(self, key):
        train_model = TrainModelResource.get_by_id(key)

        if 'Fmdev-Api-Key' not in request.headers:
            return False

        if request.headers['Fmdev-Api-Key'] == train_model.api_key:
            return True

        return False


    def load_model(self, filename):
        path = f"{current_app.config.get('TRAIN_MODELS')}/{filename}.sav"
        loaded_model = joblib.load(open(path, 'rb'))

        return loaded_model


    def get_variables(self, key):
        try:
            filename, split_type = key, 'TEST_FEATURES'

            filename = f"{current_app.config.get(split_type)}/{filename}.csv"
            df = pd.read_csv(filename)

            data = df.iloc[0].to_dict()

            return data

        except Exception:
            traceback.print_exc()
            return {"msg": "Error on GET Model Variables"}, 500


    def get_payload(self, variables, payload):
        where_clousure = ""

        if payload['courses'] is not None and len(payload['courses']) > 0:
            courses = utils.list_to_sql_string(payload['courses'])
            where_clousure = f"WHERE curso IN ({courses})"

        if payload['subjects'] is not None and len(payload['subjects']) > 0:
            subjects = utils.list_to_sql_string(payload['subjects'])

            if where_clousure != '':
                where_clousure += f" AND nome_da_disciplina IN ({subjects})"
            else:
                where_clousure += f"WHERE nome_da_disciplina IN ({subjects})"

        if payload['semesters'] is not None and len(payload['semesters']) > 0:
            semesters = utils.list_to_sql_string(payload['semesters'])

            if where_clousure != '':
                where_clousure += f" AND semestre IN ({semesters})"
            else:
                where_clousure += f"WHERE semestre IN ({semesters})"


        if payload['periods'] is not None and len(payload['periods']) > 0:
            periods = utils.list_to_sql_string(payload['periods'])

            if where_clousure != '':
                where_clousure += f" AND período IN ({periods})"
            else:
                where_clousure = f"WHERE período IN ({periods})"

        if payload['students'] is not None and len(payload['students']) > 0:
            students = utils.list_to_sql_string(payload['students'])

            if where_clousure != '':
                where_clousure += f" AND nome_do_aluno IN ({students})"
            else:
                where_clousure = f"WHERE nome_do_aluno IN ({students})"

            # if len(where_clousure) > 0:
            #     where_clousure += " AND "

            # where_clousure += "("

            # for index, student in enumerate(payload['students']):
            #     if index == len(payload['students']) - 1:
            #         if index > 0:
            #             where_clousure += " or "
            #         where_clousure += f"""("nome_do_aluno" = '{student}'))"""
            #     elif index == 0:
            #         where_clousure += f"""("nome_do_aluno" = '{student}')"""
            #     else:
            #         where_clousure += f""" or ("nome_do_aluno" = '{student}')"""

        query = f"""SELECT
                        {variables}
                    FROM
                        moodle
                    {where_clousure}
                    ORDER BY
                        "nome_do_aluno" ASC, "ctid" ASC"""

        data = utils.execute_query(query)

        query_student_names = f"""SELECT
                        id_do_aluno, nome_do_aluno
                    FROM
                        moodle
                    {where_clousure}
                    ORDER BY
                        "nome_do_aluno" ASC, "ctid" ASC"""

        student_names = utils.execute_query(query_student_names)

        return data, student_names


    def post(self, key):
        try:
            # is_api_key_valid = self.is_api_key_valid(key)

            # if is_api_key_valid == False:
            #     return {'msg': 'Fmdev-Api-Key is not valid'}, 401

            model_variables_key_value = self.get_variables(key)
            variables = ", ".join(model_variables_key_value)

            payload = request.get_json()

            query_select_response, students = self.get_payload(variables, payload)

            x_test = pd.DataFrame(query_select_response)
            model = self.load_model(filename=key)
            predict = model.predict(x_test)
            predicted_data = predict.tolist()
            TrainModelResource.update_predict(key)

            real_data = self.format_real_data(students, query_select_response)

            return { 'predictedData': predicted_data, 'realData': real_data}
        except:
            traceback.print_exc()
            return {"msg": "Error on GET Copy"}, 500


    def format_real_data(self, students, query_select_response):
        for index, value_dict in enumerate(query_select_response):
            value_dict.update(students[index])
        return query_select_response
