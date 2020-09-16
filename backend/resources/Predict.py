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
            where_clousure += f"""("curso" ILIKE '%%{payload['courses'][0]}%%')"""

        if payload['subjects'] is not None and len(payload['subjects']) > 0:
            if len(where_clousure) > 0:
                where_clousure += f"""AND ("nome_da_disciplina" ILIKE '%%{payload['subjects'][0]}%%')"""
            else:
                where_clousure += f"""("nome_da_disciplina" ILIKE '%%{payload['subjects'][0]}%%')"""

        if payload['semesters'] is not None and len(payload['semesters']) > 0:
            if len(where_clousure) > 0:
                where_clousure += f"""AND ("semestre" ILIKE '%%{payload['semesters'][0]}%%')"""
            else:
                where_clousure += f"""("semestre" ILIKE '%%{payload['semesters'][0]}%%')"""

        # periods = f"""AND ("período" ILIKE "%{payload['periods']}%%")""" if payload['periods'] != None else ''

        query = f"""SELECT
                        {variables}
                    FROM
                        moodle
                    WHERE
                        {where_clousure}
                    ORDER BY
                        "semestre" DESC, "ctid" DESC"""

        data = utils.execute_query(query)
        return data


    def post(self, key):
        try:
            # is_api_key_valid = self.is_api_key_valid(key)

            # if is_api_key_valid == False:
            #     return {'msg': 'Fmdev-Api-Key is not valid'}, 401

            model_variables_key_value = self.get_variables(key)
            variables = ", ".join(model_variables_key_value)

            payload = request.get_json()

            query_select_response = self.get_payload(variables, payload)

            x_test = pd.DataFrame(query_select_response) 
            model = self.load_model(filename=key)
            predict = model.predict(x_test)

            data_predicted = predict.tolist()
            TrainModelResource.update_predict(key)

            print(data_predicted)

            # formatted_predicted_data = self.format_data(data_predicted)

            return { 'data': data_predicted }
        except:
            traceback.print_exc()
            return {"msg": "Error on GET Copy"}, 500


    def format_Data(self, data_predicted):
        countZeros = 0
        countOnes = 0

        predictionResult = data_predicted

        for uniqueResult in predictionResult:
            if uniqueResult == 0:
                countZeros += 1
            else:
                countOnes += 1

        barChartDataDynamic = {
            x: ['Aprovados', 'Reprovados'],
            y: [countOnes, countZeros],
            marker: {
                color: ['green', 'red'],
            },
            'type': 'bar'
        }

        barChartLayoutDynamic = {
            title: 'Desempenho Binário',
        }

        pieChartDataDynamic = {
            values: [countOnes, countZeros],
            labels: ['Aprovados', 'Reprovados'],
            'type': 'pie',
        }

        pieChartLayoutDynamic = {
            title: 'Desempenho Binário',
        }

        formatted_predicted_data = {
            barChartLayoutDynamic,
            barChartDataDynamic
        }
