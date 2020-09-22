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
            where_clousure += "("
            for index, course in enumerate(payload['courses']):
                if index == len(payload['courses']) - 1:
                    if index > 0:
                        where_clousure += " or"
                    where_clousure += f"""("curso" ILIKE '%%{course}%%'))"""
                elif index == 0:
                    where_clousure += f"""("curso" ILIKE '%%{course}%%')"""
                else:
                    where_clousure += f""" or ("curso" ILIKE '%%{course}%%')"""

        if payload['subjects'] is not None and len(payload['subjects']) > 0:
            if len(where_clousure) > 0:
                where_clousure += " AND "

            where_clousure += "("

            for index, subject in enumerate(payload['subjects']):
                if index == len(payload['subjects']) - 1:
                    if index > 0:
                        where_clousure += " or "
                    where_clousure += f"""("nome_da_disciplina" ILIKE '%%{subject}%%'))"""
                elif index == 0:
                    where_clousure += f"""("nome_da_disciplina" ILIKE '%%{subject}%%')"""
                else:
                    where_clousure += f""" or ("nome_da_disciplina" ILIKE '%%{subject}%%')"""

        if payload['semesters'] is not None and len(payload['semesters']) > 0:
            if len(where_clousure) > 0:
                where_clousure += " AND "

            where_clousure += "("

            for index, semester in enumerate(payload['semesters']):
                if index == len(payload['semesters']) - 1:
                    if index > 0:
                        where_clousure += " or "
                    where_clousure += f"""("semestre" = '{semester}'))"""
                elif index == 0:
                    where_clousure += f"""("semestre" = '{semester}')"""
                else:
                    where_clousure += f""" or ("semestre" = '{semester}')"""

        if payload['periods'] is not None and len(payload['periods']) > 0:
            if len(where_clousure) > 0:
                where_clousure += " AND "

            where_clousure += "("

            for index, period in enumerate(payload['periods']):
                if index == len(payload['periods']) - 1:
                    if index > 0:
                        where_clousure += " or "
                    where_clousure += f"""("período" = '{period}'))"""
                elif index == 0:
                    where_clousure += f"""("período" = '{period}')"""
                else:
                    where_clousure += f""" or ("período" = '{period}')"""

        if payload['students'] is not None and len(payload['students']) > 0:
            if len(where_clousure) > 0:
                where_clousure += " AND "

            where_clousure += "("

            for index, student in enumerate(payload['students']):
                if index == len(payload['students']) - 1:
                    if index > 0:
                        where_clousure += " or "
                    where_clousure += f"""("nome_do_aluno" = '{student}'))"""
                elif index == 0:
                    where_clousure += f"""("nome_do_aluno" = '{student}')"""
                else:
                    where_clousure += f""" or ("nome_do_aluno" = '{student}')"""

        query = f"""SELECT
                        {variables}
                    FROM
                        moodle
                    WHERE
                        {where_clousure}
                    ORDER BY
                        "nome_do_aluno" ASC, "ctid" ASC"""

        data = utils.execute_query(query)

        query_student_names = f"""SELECT
                        nome_do_aluno
                    FROM
                        moodle
                    WHERE
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

            query_select_response, student_names = self.get_payload(variables, payload)

            x_test = pd.DataFrame(query_select_response) 
            model = self.load_model(filename=key)
            predict = model.predict(x_test)
            data_predicted = predict.tolist()
            print(data_predicted)
            TrainModelResource.update_predict(key)

            return { 'data': data_predicted, 'student_names': student_names}
        except:
            traceback.print_exc()
            return {"msg": "Error on GET Copy"}, 500
