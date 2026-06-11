import React, { useState, useMemo, useEffect } from "react";

const DATA = [{"c": "Netherlands", "iso": "NLD", "region": "Europe", "p": {"health": 91.64, "development": 91.52, "freedom": 96.65, "power": 75.84, "safety": 98.75, "governance": 85.15}, "raw": {"le": 82.158, "gni": 68344, "eys": 18.58485031, "mys": 12.66994689, "elcano": 457.1, "hom": 0.69089305, "cpi": 78.0, "fh": 97.0, "rsf": 88.64}}, {"c": "Germany", "iso": "DEU", "region": "Europe", "p": {"health": 89.09, "development": 91.73, "freedom": 92.64, "power": 84.18, "safety": 98.31, "governance": 81.44}, "raw": {"le": 81.378, "gni": 64053, "eys": 17.30921936, "mys": 14.29637163, "elcano": 917.5, "hom": 0.9107228, "cpi": 75.0, "fh": 95.0, "rsf": 83.85}}, {"c": "Switzerland", "iso": "CHE", "region": "Europe", "p": {"health": 97.52, "development": 92.93, "freedom": 93.3, "power": 68.1, "safety": 98.94, "governance": 88.86}, "raw": {"le": 83.954, "gni": 81949, "eys": 16.66753006, "mys": 13.94912109, "elcano": 239.6, "hom": 0.59748197, "cpi": 81.0, "fh": 96.0, "rsf": 83.98}}, {"c": "Norway", "iso": "NOR", "region": "Europe", "p": {"health": 95.41, "development": 100.0, "freedom": 100.0, "power": 57.59, "safety": 98.68, "governance": 88.86}, "raw": {"le": 83.308, "gni": 112710, "eys": 18.79285049, "mys": 13.11796218, "elcano": 99.6, "hom": 0.72474706, "cpi": 81.0, "fh": 99.0, "rsf": 92.31}}, {"c": "Denmark", "iso": "DNK", "region": "Europe", "p": {"health": 90.91, "development": 94.11, "freedom": 95.64, "power": 59.64, "safety": 98.45, "governance": 100.0}, "raw": {"le": 81.933, "gni": 76008, "eys": 18.70401001, "mys": 13.0273206, "elcano": 118.1, "hom": 0.8405994, "cpi": 90.0, "fh": 97.0, "rsf": 86.93}}, {"c": "Sweden", "iso": "SWE", "region": "Europe", "p": {"health": 95.25, "development": 92.11, "freedom": 97.53, "power": 63.32, "safety": 97.83, "governance": 87.62}, "raw": {"le": 83.262, "gni": 66102, "eys": 18.99147034, "mys": 12.74032574, "elcano": 160.7, "hom": 1.146757, "cpi": 80.0, "fh": 99.0, "rsf": 88.13}}, {"c": "Australia", "iso": "AUS", "region": "Oceania", "p": {"health": 97.42, "development": 94.28, "freedom": 86.9, "power": 70.26, "safety": 98.42, "governance": 83.91}, "raw": {"le": 83.923, "gni": 58277, "eys": 20.65477943, "mys": 12.86999989, "elcano": 287.0, "hom": 0.85440606, "cpi": 77.0, "fh": 94.0, "rsf": 75.15}}, {"c": "Ireland", "iso": "IRL", "region": "Europe", "p": {"health": 92.47, "development": 94.53, "freedom": 96.22, "power": 64.13, "safety": 98.82, "governance": 83.91}, "raw": {"le": 82.412, "gni": 90885, "eys": 19.1848793, "mys": 11.72499956, "elcano": 172.0, "hom": 0.6542702, "cpi": 77.0, "fh": 98.0, "rsf": 86.92}}, {"c": "Canada", "iso": "CAN", "region": "North America", "p": {"health": 93.19, "development": 85.42, "freedom": 90.8, "power": 76.85, "safety": 96.16, "governance": 81.44}, "raw": {"le": 82.63, "gni": 54688, "eys": 15.88825989, "mys": 13.86999989, "elcano": 497.5, "hom": 1.9796889, "cpi": 75.0, "fh": 97.0, "rsf": 78.75}}, {"c": "United Kingdom", "iso": "GBR", "region": "Europe", "p": {"health": 88.84, "development": 88.61, "freedom": 87.93, "power": 83.49, "safety": 97.89, "governance": 76.49}, "raw": {"le": 81.302, "gni": 54372, "eys": 17.81106949, "mys": 13.48999977, "elcano": 866.0, "hom": 1.1186842, "cpi": 71.0, "fh": 92.0, "rsf": 78.89}}, {"c": "Japan", "iso": "JPN", "region": "Asia", "p": {"health": 100.0, "development": 79.89, "freedom": 80.99, "power": 83.66, "safety": 99.68, "governance": 76.49}, "raw": {"le": 84.712, "gni": 47775, "eys": 15.51198006, "mys": 12.68404671, "elcano": 878.1, "hom": 0.2291532, "cpi": 71.0, "fh": 96.0, "rsf": 63.14}}, {"c": "Finland", "iso": "FIN", "region": "Europe", "p": {"health": 90.83, "development": 91.73, "freedom": 97.56, "power": 52.15, "safety": 98.16, "governance": 97.53}, "raw": {"le": 81.91, "gni": 57068, "eys": 19.49408913, "mys": 12.97962547, "elcano": 63.2, "hom": 0.98193496, "cpi": 88.0, "fh": 100.0, "rsf": 87.18}}, {"c": "France", "iso": "FRA", "region": "Europe", "p": {"health": 95.46, "development": 80.94, "freedom": 84.82, "power": 80.94, "safety": 97.43, "governance": 71.54}, "raw": {"le": 83.325, "gni": 55060, "eys": 16.09511948, "mys": 11.7656677, "elcano": 700.1, "hom": 1.3478885, "cpi": 67.0, "fh": 89.0, "rsf": 76.62}}, {"c": "Belgium", "iso": "BEL", "region": "Europe", "p": {"health": 91.5, "development": 91.45, "freedom": 90.43, "power": 66.8, "safety": 97.97, "governance": 74.01}, "raw": {"le": 82.115, "gni": 63582, "eys": 18.99603081, "mys": 12.68965045, "elcano": 214.8, "hom": 1.0803015, "cpi": 69.0, "fh": 95.0, "rsf": 80.12}}, {"c": "United States", "iso": "USA", "region": "North America", "p": {"health": 82.3, "development": 89.74, "freedom": 73.51, "power": 100.0, "safety": 88.55, "governance": 69.06}, "raw": {"le": 79.304, "gni": 73650, "eys": 15.92300034, "mys": 13.90999985, "elcano": 3438.3, "hom": 5.7634077, "cpi": 65.0, "fh": 81.0, "rsf": 65.487}}, {"c": "South Korea", "iso": "KOR", "region": "Asia", "p": {"health": 98.75, "development": 82.95, "freedom": 73.85, "power": 74.59, "safety": 99.18, "governance": 67.83}, "raw": {"le": 84.329, "gni": 49726, "eys": 16.6186409, "mys": 12.72219869, "elcano": 411.8, "hom": 0.4773063, "cpi": 64.0, "fh": 83.0, "rsf": 64.06}}, {"c": "Austria", "iso": "AUT", "region": "Europe", "p": {"health": 90.98, "development": 84.76, "freedom": 88.66, "power": 60.32, "safety": 98.38, "governance": 71.54}, "raw": {"le": 81.956, "gni": 63479, "eys": 16.28428078, "mys": 12.36146506, "elcano": 125.1, "hom": 0.876191, "cpi": 67.0, "fh": 94.0, "rsf": 78.12}}, {"c": "New Zealand", "iso": "NZL", "region": "Oceania", "p": {"health": 91.41, "development": 88.45, "freedom": 93.53, "power": 42.79, "safety": 97.2, "governance": 91.34}, "raw": {"le": 82.088, "gni": 47260, "eys": 19.30005074, "mys": 12.88299807, "elcano": 28.9, "hom": 1.4614942, "cpi": 83.0, "fh": 99.0, "rsf": 81.37}}, {"c": "Spain", "iso": "ESP", "region": "Europe", "p": {"health": 96.59, "development": 79.8, "freedom": 86.43, "power": 71.54, "safety": 98.75, "governance": 57.92}, "raw": {"le": 83.67, "gni": 46008, "eys": 17.83031082, "mys": 10.75612495, "elcano": 319.1, "hom": 0.690856, "cpi": 56.0, "fh": 91.0, "rsf": 77.35}}, {"c": "Luxembourg", "iso": "LUX", "region": "Europe", "p": {"health": 91.87, "development": 85.25, "freedom": 93.34, "power": 40.55, "safety": 97.06, "governance": 88.86}, "raw": {"le": 82.229, "gni": 85461, "eys": 14.35795021, "mys": 12.58937195, "elcano": 24.0, "hom": 1.5306611, "cpi": 81.0, "fh": 97.0, "rsf": 83.04}}, {"c": "Italy", "iso": "ITA", "region": "Europe", "p": {"health": 96.74, "development": 79.36, "freedom": 78.55, "power": 74.2, "safety": 99.0, "governance": 55.45}, "raw": {"le": 83.716, "gni": 52389, "eys": 16.71419907, "mys": 10.82812827, "elcano": 398.6, "hom": 0.56807244, "cpi": 54.0, "fh": 87.0, "rsf": 68.01}}, {"c": "Singapore", "iso": "SGP", "region": "Asia", "p": {"health": 96.81, "development": 92.67, "freedom": 42.36, "power": 67.1, "safety": 100.0, "governance": 92.58}, "raw": {"le": 83.736, "gni": 111239, "eys": 16.74227905, "mys": 11.98999977, "elcano": 220.4, "hom": 0.06909549, "cpi": 84.0, "fh": 48.0, "rsf": 45.78}}, {"c": "Czechia", "iso": "CZE", "region": "Europe", "p": {"health": 84.04, "development": 82.79, "freedom": 92.7, "power": 55.05, "safety": 98.59, "governance": 57.92}, "raw": {"le": 79.834, "gni": 45889, "eys": 16.7935009, "mys": 12.96318214, "elcano": 80.5, "hom": 0.76782775, "cpi": 56.0, "fh": 95.0, "rsf": 83.96}}, {"c": "Portugal", "iso": "PRT", "region": "Europe", "p": {"health": 92.3, "development": 74.96, "freedom": 93.47, "power": 52.54, "safety": 98.69, "governance": 59.16}, "raw": {"le": 82.36, "gni": 41064, "eys": 17.48682022, "mys": 9.703254412, "elcano": 65.3, "hom": 0.71997195, "cpi": 57.0, "fh": 96.0, "rsf": 84.26}}, {"c": "Poland", "iso": "POL", "region": "Europe", "p": {"health": 80.11, "development": 81.96, "freedom": 79.6, "power": 61.44, "safety": 98.53, "governance": 54.21}, "raw": {"le": 78.633, "gni": 42218, "eys": 16.67827988, "mys": 13.20854242, "elcano": 137.3, "hom": 0.8023147, "cpi": 53.0, "fh": 82.0, "rsf": 74.79}}, {"c": "Estonia", "iso": "EST", "region": "Europe", "p": {"health": 81.81, "development": 80.81, "freedom": 96.54, "power": 32.13, "safety": 97.05, "governance": 82.67}, "raw": {"le": 79.153, "gni": 40881, "eys": 15.96786022, "mys": 13.56216597, "elcano": 11.9, "hom": 1.5359905, "cpi": 76.0, "fh": 96.0, "rsf": 89.46}}, {"c": "Israel", "iso": "ISR", "region": "Asia", "p": {"health": 92.46, "development": 80.75, "freedom": 60.25, "power": 55.24, "safety": 96.87, "governance": 67.83}, "raw": {"le": 82.408, "gni": 48050, "eys": 14.93416023, "mys": 13.53459474, "elcano": 81.8, "hom": 1.6258106, "cpi": 64.0, "fh": 73.0, "rsf": 51.055}}, {"c": "Slovenia", "iso": "SVN", "region": "Europe", "p": {"health": 89.83, "development": 84.38, "freedom": 88.03, "power": 38.76, "safety": 99.0, "governance": 62.88}, "raw": {"le": 81.603, "gni": 46361, "eys": 17.47717094, "mys": 12.95120192, "elcano": 20.7, "hom": 0.56646633, "cpi": 60.0, "fh": 97.0, "rsf": 74.06}}, {"c": "Chile", "iso": "CHL", "region": "South America", "p": {"health": 88.4, "development": 72.2, "freedom": 79.87, "power": 51.9, "safety": 87.37, "governance": 66.59}, "raw": {"le": 81.167, "gni": 28047, "eys": 16.91242027, "mys": 11.29105394, "elcano": 61.9, "hom": 6.348291, "cpi": 63.0, "fh": 95.0, "rsf": 62.25}}, {"c": "Iceland", "iso": "ISL", "region": "Europe", "p": {"health": 93.39, "development": 95.21, "freedom": 91.16, "power": 22.07, "safety": 97.54, "governance": 83.91}, "raw": {"le": 82.691, "gni": 69117, "eys": 18.85058975, "mys": 13.90892628, "elcano": 5.1, "hom": 1.2901311, "cpi": 77.0, "fh": 95.0, "rsf": 81.36}}, {"c": "Greece", "iso": "GRC", "region": "Europe", "p": {"health": 90.66, "development": 84.76, "freedom": 69.89, "power": 53.37, "safety": 98.45, "governance": 49.26}, "raw": {"le": 81.857, "gni": 35761, "eys": 20.84550095, "mys": 11.55385642, "elcano": 70.0, "hom": 0.8396053, "cpi": 49.0, "fh": 85.0, "rsf": 55.37}}, {"c": "Lithuania", "iso": "LTU", "region": "Europe", "p": {"health": 71.57, "development": 82.34, "freedom": 88.75, "power": 38.37, "safety": 94.85, "governance": 66.59}, "raw": {"le": 76.025, "gni": 41916, "eys": 16.45467949, "mys": 13.61069239, "elcano": 20.0, "hom": 2.6277995, "cpi": 63.0, "fh": 90.0, "rsf": 82.27}}, {"c": "Slovakia", "iso": "SVK", "region": "Europe", "p": {"health": 79.15, "development": 76.03, "freedom": 81.45, "power": 42.55, "safety": 97.88, "governance": 49.26}, "raw": {"le": 78.341, "gni": 36793, "eys": 14.94684982, "mys": 13.10320397, "elcano": 28.3, "hom": 1.1235844, "cpi": 49.0, "fh": 88.0, "rsf": 71.93}}, {"c": "Cyprus", "iso": "CYP", "region": "Europe", "p": {"health": 89.97, "development": 80.41, "freedom": 75.02, "power": 32.35, "safety": 98.21, "governance": 57.92}, "raw": {"le": 81.648, "gni": 45394, "eys": 16.21559906, "mys": 12.5573721, "elcano": 12.1, "hom": 0.9570879, "cpi": 56.0, "fh": 90.0, "rsf": 59.04}}, {"c": "Uruguay", "iso": "URY", "region": "South America", "p": {"health": 78.49, "development": 71.94, "freedom": 82.78, "power": 31.61, "safety": 77.53, "governance": 82.67}, "raw": {"le": 78.138, "gni": 28650, "eys": 17.4839592, "mys": 10.53999996, "elcano": 11.4, "hom": 11.245305, "cpi": 76.0, "fh": 97.0, "rsf": 65.18}}, {"c": "Latvia", "iso": "LVA", "region": "Europe", "p": {"health": 72.11, "development": 80.55, "freedom": 87.89, "power": 29.41, "safety": 95.12, "governance": 61.64}, "raw": {"le": 76.19, "gni": 37998, "eys": 16.48265076, "mys": 13.40943983, "elcano": 9.5, "hom": 2.4968178, "cpi": 59.0, "fh": 89.0, "rsf": 81.82}}, {"c": "Romania", "iso": "ROU", "region": "Europe", "p": {"health": 71.29, "development": 71.32, "freedom": 75.24, "power": 49.26, "safety": 97.89, "governance": 45.55}, "raw": {"le": 75.938, "gni": 39374, "eys": 14.05288029, "mys": 11.55000019, "elcano": 49.6, "hom": 1.1201626, "cpi": 46.0, "fh": 83.0, "rsf": 66.42}}, {"c": "Qatar", "iso": "QAT", "region": "Asia", "p": {"health": 92.33, "development": 81.17, "freedom": 36.14, "power": 49.75, "safety": 100.0, "governance": 61.64}, "raw": {"le": 82.368, "gni": 105353, "eys": 13.14116001, "mys": 10.77000046, "elcano": 51.7, "hom": 0.06914541, "cpi": 59.0, "fh": 25.0, "rsf": 58.25}}, {"c": "Croatia", "iso": "HRV", "region": "Europe", "p": {"health": 79.93, "development": 78.31, "freedom": 73.34, "power": 38.72, "safety": 98.8, "governance": 46.79}, "raw": {"le": 78.58, "gni": 41380, "eys": 16.34815025, "mys": 12.0951217, "elcano": 20.6, "hom": 0.66734713, "cpi": 47.0, "fh": 82.0, "rsf": 64.2}}, {"c": "Malaysia", "iso": "MYS", "region": "Asia", "p": {"health": 73.64, "development": 64.59, "freedom": 51.41, "power": 60.26, "safety": 98.66, "governance": 50.5}, "raw": {"le": 76.657, "gni": 32553, "eys": 12.67639256, "mys": 11.09000015, "elcano": 124.4, "hom": 0.7344924, "cpi": 50.0, "fh": 53.0, "rsf": 56.09}}, {"c": "Hungary", "iso": "HUN", "region": "Europe", "p": {"health": 74.84, "development": 75.49, "freedom": 62.48, "power": 51.41, "safety": 98.69, "governance": 39.36}, "raw": {"le": 77.024, "gni": 37236, "eys": 15.46940041, "mys": 12.33162229, "elcano": 59.4, "hom": 0.722658, "cpi": 41.0, "fh": 65.0, "rsf": 62.82}}, {"c": "Malta", "iso": "MLT", "region": "Europe", "p": {"health": 95.38, "development": 81.35, "freedom": 76.15, "power": 26.35, "safety": 99.01, "governance": 45.55}, "raw": {"le": 83.299, "gni": 52155, "eys": 15.90985012, "mys": 12.4207021, "elcano": 7.3, "hom": 0.5628983, "cpi": 46.0, "fh": 88.0, "rsf": 62.96}}, {"c": "Argentina", "iso": "ARG", "region": "South America", "p": {"health": 76.05, "development": 75.0, "freedom": 70.35, "power": 49.7, "safety": 91.1, "governance": 34.41}, "raw": {"le": 77.395, "gni": 25876, "eys": 18.83120918, "mys": 11.18458184, "elcano": 51.5, "hom": 4.4929113, "cpi": 37.0, "fh": 85.0, "rsf": 56.14}}, {"c": "Bulgaria", "iso": "BGR", "region": "Europe", "p": {"health": 70.3, "development": 71.03, "freedom": 66.59, "power": 40.67, "safety": 97.95, "governance": 41.84}, "raw": {"le": 75.636, "gni": 32175, "eys": 15.3166399, "mys": 11.45453092, "elcano": 24.2, "hom": 1.0889074, "cpi": 43.0, "fh": 74.0, "rsf": 60.78}}, {"c": "Costa Rica", "iso": "CRI", "region": "North America", "p": {"health": 87.19, "development": 62.63, "freedom": 83.91, "power": 30.75, "safety": 64.45, "governance": 60.4}, "raw": {"le": 80.799, "gni": 23417, "eys": 16.34963687, "mys": 8.844752499, "elcano": 10.6, "hom": 17.74548, "cpi": 58.0, "fh": 91.0, "rsf": 73.09}}, {"c": "United Arab Emirates", "iso": "ARE", "region": "Asia", "p": {"health": 94.1, "development": 86.36, "freedom": 13.48, "power": 67.06, "safety": 98.74, "governance": 72.78}, "raw": {"le": 82.909, "gni": 71142, "eys": 15.60159016, "mys": 12.98999977, "elcano": 219.6, "hom": 0.6932181, "cpi": 68.0, "fh": 18.0, "rsf": 26.91}}, {"c": "Kuwait", "iso": "KWT", "region": "Asia", "p": {"health": 85.9, "development": 70.88, "freedom": 30.7, "power": 45.59, "safety": 99.64, "governance": 45.55}, "raw": {"le": 80.405, "gni": 56612, "eys": 15.90424029, "mys": 7.566007112, "elcano": 36.6, "hom": 0.24999182, "cpi": 46.0, "fh": 30.0, "rsf": 44.06}}, {"c": "Oman", "iso": "OMN", "region": "Asia", "p": {"health": 84.68, "development": 69.59, "freedom": 26.11, "power": 40.51, "safety": 99.86, "governance": 56.69}, "raw": {"le": 80.031, "gni": 36096, "eys": 13.43931961, "mys": 11.89000034, "elcano": 23.9, "hom": 0.13863392, "cpi": 55.0, "fh": 24.0, "rsf": 42.29}}, {"c": "Georgia", "iso": "GEO", "region": "Asia", "p": {"health": 66.57, "development": 71.03, "freedom": 46.94, "power": 28.49, "safety": 96.06, "governance": 54.21}, "raw": {"le": 74.496, "gni": 20753, "eys": 16.75470924, "mys": 12.69999981, "elcano": 8.8, "hom": 2.028065, "cpi": 53.0, "fh": 51.0, "rsf": 50.53}}, {"c": "Armenia", "iso": "ARM", "region": "Asia", "p": {"health": 70.45, "development": 62.28, "freedom": 62.56, "power": 26.48, "safety": 95.7, "governance": 46.79}, "raw": {"le": 75.683, "gni": 20221, "eys": 14.3838501, "mys": 11.34497821, "elcano": 7.4, "hom": 2.2083356, "cpi": 47.0, "fh": 54.0, "rsf": 73.96}}, {"c": "Brazil", "iso": "BRA", "region": "South America", "p": {"health": 70.99, "development": 56.76, "freedom": 67.78, "power": 64.42, "safety": 58.76, "governance": 30.7}, "raw": {"le": 75.848, "gni": 18011, "eys": 15.7927103, "mys": 8.425371752, "elcano": 176.2, "hom": 20.575377, "cpi": 34.0, "fh": 73.0, "rsf": 63.8}}, {"c": "Ukraine", "iso": "UKR", "region": "Europe", "p": {"health": 63.05, "development": 56.99, "freedom": 54.86, "power": 50.82, "safety": 92.54, "governance": 31.94}, "raw": {"le": 73.422, "gni": 16933, "eys": 13.32800961, "mys": 11.12273899, "elcano": 56.6, "hom": 3.7766397, "cpi": 35.0, "fh": 51.0, "rsf": 63.93}}, {"c": "Albania", "iso": "ALB", "region": "Europe", "p": {"health": 83.28, "development": 57.86, "freedom": 62.1, "power": 25.03, "safety": 96.61, "governance": 40.6}, "raw": {"le": 79.602, "gni": 17627, "eys": 14.51014996, "mys": 10.17531099, "elcano": 6.6, "hom": 1.7551677, "cpi": 42.0, "fh": 69.0, "rsf": 58.18}}, {"c": "Panama", "iso": "PAN", "region": "North America", "p": {"health": 83.25, "development": 66.12, "freedom": 74.85, "power": 30.92, "safety": 75.06, "governance": 29.46}, "raw": {"le": 79.594, "gni": 34385, "eys": 13.3116098, "mys": 10.83375095, "elcano": 10.7, "hom": 12.469837, "cpi": 33.0, "fh": 82.0, "rsf": 66.75}}, {"c": "Serbia", "iso": "SRB", "region": "Europe", "p": {"health": 74.0, "development": 66.28, "freedom": 49.91, "power": 36.68, "safety": 97.5, "governance": 31.94}, "raw": {"le": 76.769, "gni": 23115, "eys": 15.04216003, "mys": 11.64171812, "elcano": 17.4, "hom": 1.314002, "cpi": 35.0, "fh": 53.0, "rsf": 53.55}}, {"c": "Indonesia", "iso": "IDN", "region": "Asia", "p": {"health": 55.6, "development": 48.27, "freedom": 46.11, "power": 61.2, "safety": 99.53, "governance": 34.41}, "raw": {"le": 71.146, "gni": 13700, "eys": 13.33577728, "mys": 8.6972232, "elcano": 134.6, "hom": 0.30376875, "cpi": 37.0, "fh": 56.0, "rsf": 44.13}}, {"c": "Turkey", "iso": "TUR", "region": "Asia", "p": {"health": 75.27, "development": 75.92, "freedom": 23.22, "power": 67.54, "safety": 93.65, "governance": 30.7}, "raw": {"le": 77.156, "gni": 34507, "eys": 19.8307991, "mys": 8.98624366, "elcano": 228.6, "hom": 3.2278948, "cpi": 34.0, "fh": 32.0, "rsf": 29.4}}, {"c": "India", "iso": "IND", "region": "Asia", "p": {"health": 58.41, "development": 37.32, "freedom": 43.06, "power": 76.07, "safety": 94.48, "governance": 35.65}, "raw": {"le": 72.003, "gni": 9047, "eys": 12.95454025, "mys": 6.880000114, "elcano": 466.1, "hom": 2.8153043, "cpi": 38.0, "fh": 62.0, "rsf": 32.96}}, {"c": "Saudi Arabia", "iso": "SAU", "region": "Asia", "p": {"health": 80.43, "development": 81.16, "freedom": 8.77, "power": 67.14, "safety": 98.26, "governance": 61.64}, "raw": {"le": 78.732, "gni": 50299, "eys": 16.94943047, "mys": 11.60642778, "elcano": 221.1, "hom": 0.93525994, "cpi": 59.0, "fh": 9.0, "rsf": 27.94}}, {"c": "Dominican Republic", "iso": "DOM", "region": "North America", "p": {"health": 64.03, "development": 57.27, "freedom": 67.83, "power": 34.77, "safety": 78.19, "governance": 33.17}, "raw": {"le": 73.72, "gni": 22024, "eys": 13.61692047, "mys": 9.444525756, "elcano": 14.8, "hom": 10.9166975, "cpi": 36.0, "fh": 67.0, "rsf": 69.87}}, {"c": "Mauritius", "iso": "MUS", "region": "Africa", "p": {"health": 67.97, "development": 63.0, "freedom": 78.13, "power": 13.53, "safety": 95.57, "governance": 51.74}, "raw": {"le": 74.926, "gni": 27280, "eys": 14.16282114, "mys": 10.10332754, "elcano": 2.5, "hom": 2.2724967, "cpi": 51.0, "fh": 87.0, "rsf": 67.31}}, {"c": "North Macedonia", "iso": "MKD", "region": "Europe", "p": {"health": 76.05, "development": 61.74, "freedom": 68.16, "power": 18.84, "safety": 97.07, "governance": 38.12}, "raw": {"le": 77.395, "gni": 22128, "eys": 14.78143978, "mys": 10.22999954, "elcano": 3.9, "hom": 1.5285499, "cpi": 40.0, "fh": 67.0, "rsf": 70.44}}, {"c": "Colombia", "iso": "COL", "region": "South America", "p": {"health": 77.13, "development": 55.43, "freedom": 57.15, "power": 47.68, "safety": 50.04, "governance": 36.89}, "raw": {"le": 77.725, "gni": 18666, "eys": 14.28641033, "mys": 9.031581597, "elcano": 43.5, "hom": 24.913443, "cpi": 39.0, "fh": 69.0, "rsf": 49.8}}, {"c": "Peru", "iso": "PER", "region": "South America", "p": {"health": 77.18, "development": 55.8, "freedom": 51.28, "power": 41.47, "safety": 82.84, "governance": 26.99}, "raw": {"le": 77.74, "gni": 14339, "eys": 14.90939376, "mys": 10.15465159, "elcano": 25.9, "hom": 8.604808, "cpi": 31.0, "fh": 66.0, "rsf": 42.88}}, {"c": "Kazakhstan", "iso": "KAZ", "region": "Asia", "p": {"health": 66.26, "development": 70.28, "freedom": 23.78, "power": 45.49, "safety": 95.01, "governance": 38.12}, "raw": {"le": 74.402, "gni": 30989, "eys": 14.0086174, "mys": 12.54717423, "elcano": 36.2, "hom": 2.5505862, "cpi": 40.0, "fh": 23.0, "rsf": 39.34}}, {"c": "Algeria", "iso": "DZA", "region": "Africa", "p": {"health": 72.34, "development": 51.27, "freedom": 31.64, "power": 48.11, "safety": 97.8, "governance": 30.7}, "raw": {"le": 76.261, "gni": 15114, "eys": 15.4951601, "mys": 7.416386987, "elcano": 45.1, "hom": 1.1610724, "cpi": 34.0, "fh": 31.0, "rsf": 44.64}}, {"c": "Jordan", "iso": "JOR", "region": "Asia", "p": {"health": 77.42, "development": 45.95, "freedom": 27.86, "power": 35.35, "safety": 98.15, "governance": 49.26}, "raw": {"le": 77.814, "gni": 9222, "eys": 13.1090498, "mys": 10.23999977, "elcano": 15.5, "hom": 0.98783016, "cpi": 49.0, "fh": 34.0, "rsf": 35.25}}, {"c": "Philippines", "iso": "PHL", "region": "Asia", "p": {"health": 51.31, "development": 46.8, "freedom": 50.51, "power": 51.25, "safety": 91.4, "governance": 29.46}, "raw": {"le": 69.833, "gni": 10731, "eys": 12.81904666, "mys": 9.977239609, "elcano": 58.6, "hom": 4.3475914, "cpi": 33.0, "fh": 58.0, "rsf": 49.57}}, {"c": "Moldova", "iso": "MDA", "region": "Europe", "p": {"health": 55.77, "development": 60.62, "freedom": 65.75, "power": 18.28, "safety": 95.02, "governance": 41.84}, "raw": {"le": 71.198, "gni": 15867, "eys": 14.63856847, "mys": 11.82999992, "elcano": 3.7, "hom": 2.5431437, "cpi": 43.0, "fh": 60.0, "rsf": 73.36}}, {"c": "Bahrain", "iso": "BHR", "region": "Asia", "p": {"health": 88.78, "development": 78.48, "freedom": 11.9, "power": 36.02, "safety": 99.75, "governance": 54.21}, "raw": {"le": 81.284, "gni": 52819, "eys": 15.92718983, "mys": 11.13000011, "elcano": 16.4, "hom": 0.19563614, "cpi": 53.0, "fh": 12.0, "rsf": 30.24}}, {"c": "Bahamas", "iso": "BHS", "region": "North America", "p": {"health": 66.75, "development": 66.31, "freedom": 93.32, "power": 15.66, "safety": 35.39, "governance": 69.06}, "raw": {"le": 74.552, "gni": 30975, "eys": 11.89137971, "mys": 12.81441904, "elcano": 3.0, "hom": 32.19814, "cpi": 65.0, "fh": 90.0, "rsf": null}}, {"c": "Morocco", "iso": "MAR", "region": "Africa", "p": {"health": 69.24, "development": 39.68, "freedom": 37.19, "power": 45.96, "safety": 96.79, "governance": 34.41}, "raw": {"le": 75.313, "gni": 8653, "eys": 15.07499027, "mys": 6.198, "elcano": 37.7, "hom": 1.6674905, "cpi": 37.0, "fh": 37.0, "rsf": 48.04}}, {"c": "Tunisia", "iso": "TUN", "region": "Africa", "p": {"health": 73.15, "development": 46.71, "freedom": 37.45, "power": 35.97, "safety": 90.7, "governance": 36.89}, "raw": {"le": 76.508, "gni": 12011, "eys": 14.67349856, "mys": 7.594920158, "elcano": 16.4, "hom": 4.69348, "cpi": 39.0, "fh": 42.0, "rsf": 43.48}}, {"c": "Bosnia and Herzegovina", "iso": "BIH", "region": "Europe", "p": {"health": 77.54, "development": 58.46, "freedom": 52.14, "power": 20.13, "safety": 97.68, "governance": 29.46}, "raw": {"le": 77.85, "gni": 19827, "eys": 13.16394043, "mys": 10.97000027, "elcano": 4.4, "hom": 1.2244617, "cpi": 33.0, "fh": 54.0, "rsf": 56.33}}, {"c": "Mongolia", "iso": "MNG", "region": "Asia", "p": {"health": 57.53, "development": 51.71, "freedom": 67.65, "power": 24.66, "safety": 88.8, "governance": 29.46}, "raw": {"le": 71.734, "gni": 14787, "eys": 13.6376543, "mys": 9.420000076, "elcano": 6.4, "hom": 5.63941, "cpi": 33.0, "fh": 84.0, "rsf": 52.57}}, {"c": "Mexico", "iso": "MEX", "region": "North America", "p": {"health": 68.44, "development": 58.75, "freedom": 48.13, "power": 63.44, "safety": 50.15, "governance": 20.8}, "raw": {"le": 75.069, "gni": 21813, "eys": 14.46811008, "mys": 9.349510934, "elcano": 162.3, "hom": 24.858995, "cpi": 26.0, "fh": 58.0, "rsf": 45.55}}, {"c": "Sri Lanka", "iso": "LKA", "region": "Asia", "p": {"health": 76.34, "development": 51.62, "freedom": 47.77, "power": 23.96, "safety": 93.48, "governance": 28.23}, "raw": {"le": 77.483, "gni": 12616, "eys": 13.12815666, "mys": 10.77000046, "elcano": 6.0, "hom": 3.3109403, "cpi": 32.0, "fh": 63.0, "rsf": 39.93}}, {"c": "Botswana", "iso": "BWA", "region": "Africa", "p": {"health": 49.11, "development": 51.36, "freedom": 65.33, "power": 15.29, "safety": 77.28, "governance": 59.16}, "raw": {"le": 69.163, "gni": 16984, "eys": 11.42568016, "mys": 10.478, "elcano": 2.9, "hom": 11.368176, "cpi": 57.0, "fh": 75.0, "rsf": 57.64}}, {"c": "Ghana", "iso": "GHA", "region": "Africa", "p": {"health": 37.12, "development": 30.65, "freedom": 73.89, "power": 33.42, "safety": 96.46, "governance": 40.6}, "raw": {"le": 65.498, "gni": 6846, "eys": 11.41845989, "mys": 7.107210159, "elcano": 13.2, "hom": 1.8311177, "cpi": 42.0, "fh": 80.0, "rsf": 67.13}}, {"c": "Paraguay", "iso": "PRY", "region": "South America", "p": {"health": 64.43, "development": 51.73, "freedom": 57.76, "power": 25.17, "safety": 86.51, "governance": 18.32}, "raw": {"le": 73.844, "gni": 15252, "eys": 13.98706964, "mys": 8.930653385, "elcano": 6.6, "hom": 6.779516, "cpi": 24.0, "fh": 63.0, "rsf": 56.84}}, {"c": "Nepal", "iso": "NPL", "region": "Asia", "p": {"health": 53.01, "development": 24.35, "freedom": 54.43, "power": 35.19, "safety": 95.86, "governance": 30.7}, "raw": {"le": 70.354, "gni": 4726, "eys": 13.75430393, "mys": 4.50372982, "elcano": 15.3, "hom": 2.1300414, "cpi": 34.0, "fh": 59.0, "rsf": 55.2}}, {"c": "Bolivia", "iso": "BOL", "region": "South America", "p": {"health": 47.21, "development": 51.2, "freedom": 59.68, "power": 22.55, "safety": 91.25, "governance": 23.27}, "raw": {"le": 68.581, "gni": 9445, "eys": 15.61065006, "mys": 10.02122319, "elcano": 5.3, "hom": 4.418433, "cpi": 28.0, "fh": 69.0, "rsf": 54.09}}, {"c": "Lebanon", "iso": "LBN", "region": "Asia", "p": {"health": 77.43, "development": 45.99, "freedom": 36.35, "power": 32.98, "safety": 95.63, "governance": 15.85}, "raw": {"le": 77.817, "gni": 11299, "eys": 11.68299961, "mys": 10.36999989, "elcano": 12.8, "hom": 2.24467, "cpi": 22.0, "fh": 41.0, "rsf": 42.62}}, {"c": "Namibia", "iso": "NAM", "region": "Africa", "p": {"health": 43.29, "development": 38.34, "freedom": 74.61, "power": 10.28, "safety": 77.6, "governance": 49.26}, "raw": {"le": 67.385, "gni": 10917, "eys": 11.78505588, "mys": 7.273146745, "elcano": 1.9, "hom": 11.207781, "cpi": 49.0, "fh": 73.0, "rsf": 75.35}}, {"c": "Trinidad and Tobago", "iso": "TTO", "region": "North America", "p": {"health": 63.27, "development": 64.67, "freedom": 83.1, "power": 18.4, "safety": 18.81, "governance": 39.36}, "raw": {"le": 73.49, "gni": 27000, "eys": 14.23764336, "mys": 10.79275036, "elcano": 3.8, "hom": 40.4433, "cpi": 41.0, "fh": 83.0, "rsf": 79.71}}, {"c": "South Africa", "iso": "ZAF", "region": "Africa", "p": {"health": 39.22, "development": 56.21, "freedom": 79.55, "power": 52.42, "safety": 12.22, "governance": 39.36}, "raw": {"le": 66.139, "gni": 13694, "eys": 13.79325008, "mys": 11.60999966, "elcano": 64.7, "hom": 43.720257, "cpi": 41.0, "fh": 81.0, "rsf": 75.71}}, {"c": "Kenya", "iso": "KEN", "region": "Africa", "p": {"health": 31.06, "development": 31.62, "freedom": 45.1, "power": 38.52, "safety": 90.34, "governance": 28.23}, "raw": {"le": 63.646, "gni": 5608, "eys": 11.47407573, "mys": 8.624710083, "elcano": 20.3, "hom": 4.8716683, "cpi": 32.0, "fh": 49.0, "rsf": 49.41}}, {"c": "Russia", "iso": "RUS", "region": "Europe", "p": {"health": 62.17, "development": 71.44, "freedom": 8.55, "power": 81.01, "safety": 84.41, "governance": 15.85}, "raw": {"le": 73.154, "gni": 39222, "eys": 13.18515015, "mys": 12.40999985, "elcano": 703.9, "hom": 7.8214107, "cpi": 22.0, "fh": 12.0, "rsf": 24.57}}, {"c": "Uzbekistan", "iso": "UZB", "region": "Asia", "p": {"health": 59.67, "development": 47.92, "freedom": 14.85, "power": 32.47, "safety": 97.33, "governance": 28.23}, "raw": {"le": 72.388, "gni": 8826, "eys": 12.46086979, "mys": 11.90999985, "elcano": 12.2, "hom": 1.3987976, "cpi": 32.0, "fh": 12.0, "rsf": 35.24}}, {"c": "El Salvador", "iso": "SLV", "region": "North America", "p": {"health": 58.72, "development": 36.52, "freedom": 36.1, "power": 20.6, "safety": 84.26, "governance": 25.75}, "raw": {"le": 72.099, "gni": 10595, "eys": 11.11291027, "mys": 7.300000191, "elcano": 4.5, "hom": 7.897688, "cpi": 30.0, "fh": 42.0, "rsf": 41.19}}, {"c": "Belarus", "iso": "BLR", "region": "Europe", "p": {"health": 66.36, "development": 67.08, "freedom": 6.28, "power": 35.52, "safety": 95.34, "governance": 29.46}, "raw": {"le": 74.434, "gni": 26725, "eys": 13.71881008, "mys": 12.33537298, "elcano": 15.8, "hom": 2.3846316, "cpi": 33.0, "fh": 7.0, "rsf": 25.73}}, {"c": "Rwanda", "iso": "RWA", "region": "Africa", "p": {"health": 44.6, "development": 16.26, "freedom": 20.53, "power": 31.49, "safety": 92.87, "governance": 59.16}, "raw": {"le": 67.785, "gni": 2971, "eys": 12.59045029, "mys": 4.880000114, "elcano": 11.3, "hom": 3.6124742, "cpi": 57.0, "fh": 21.0, "rsf": 35.84}}, {"c": "Cuba", "iso": "CUB", "region": "North America", "p": {"health": 78.31, "development": 47.29, "freedom": 7.64, "power": 23.78, "safety": 91.16, "governance": 39.36}, "raw": {"le": 78.085, "gni": 8415, "eys": 13.87884045, "mys": 10.63148903, "elcano": 5.9, "hom": 4.4631515, "cpi": 41.0, "fh": 9.0, "rsf": 26.03}}, {"c": "Guatemala", "iso": "GTM", "region": "North America", "p": {"health": 60.37, "development": 34.36, "freedom": 39.13, "power": 23.71, "safety": 53.15, "governance": 19.56}, "raw": {"le": 72.602, "gni": 12459, "eys": 10.67763042, "mys": 5.847300053, "elcano": 5.9, "hom": 23.365726, "cpi": 25.0, "fh": 48.0, "rsf": 40.32}}, {"c": "Tanzania", "iso": "TZA", "region": "Africa", "p": {"health": 42.02, "development": 12.73, "freedom": 35.21, "power": 27.95, "safety": 92.6, "governance": 39.36}, "raw": {"le": 66.995, "gni": 3515, "eys": 8.585740089, "mys": 6.065350056, "elcano": 8.4, "hom": 3.749213, "cpi": 41.0, "fh": 28.0, "rsf": 53.68}}, {"c": "Ecuador", "iso": "ECU", "region": "South America", "p": {"health": 76.04, "development": 52.5, "freedom": 56.53, "power": 33.81, "safety": 8.19, "governance": 28.23}, "raw": {"le": 77.392, "gni": 13986, "eys": 14.85167027, "mys": 8.970000267, "elcano": 13.7, "hom": 45.722813, "cpi": 32.0, "fh": 64.0, "rsf": 53.76}}, {"c": "China", "iso": "CHN", "region": "Asia", "p": {"health": 77.88, "development": 57.95, "freedom": 1.0, "power": 93.38, "safety": 99.13, "governance": 41.84}, "raw": {"le": 77.953, "gni": 22029, "eys": 15.4787495, "mys": 8.036181597, "elcano": 1978.4, "hom": 0.5018561, "cpi": 43.0, "fh": 9.0, "rsf": 14.8}}, {"c": "Uganda", "iso": "UGA", "region": "Africa", "p": {"health": 46.13, "development": 16.34, "freedom": 28.67, "power": 40.13, "safety": 82.09, "governance": 20.8}, "raw": {"le": 68.252, "gni": 2736, "eys": 11.56404819, "mys": 6.323663082, "elcano": 23.2, "hom": 8.973088, "cpi": 26.0, "fh": 33.0, "rsf": 37.61}}, {"c": "Pakistan", "iso": "PAK", "region": "Asia", "p": {"health": 44.16, "development": 13.29, "freedom": 23.35, "power": 48.36, "safety": 91.42, "governance": 22.04}, "raw": {"le": 67.649, "gni": 5501, "eys": 7.89510849, "mys": 4.316987038, "elcano": 46.1, "hom": 4.334871, "cpi": 27.0, "fh": 32.0, "rsf": 29.62}}, {"c": "Azerbaijan", "iso": "AZE", "region": "Asia", "p": {"health": 66.35, "development": 58.73, "freedom": 5.53, "power": 36.78, "safety": 96.13, "governance": 15.85}, "raw": {"le": 74.429, "gni": 20668, "eys": 12.90977955, "mys": 11.06999969, "elcano": 17.5, "hom": 1.9929228, "cpi": 22.0, "fh": 6.0, "rsf": 25.47}}, {"c": "Honduras", "iso": "HND", "region": "North America", "p": {"health": 61.29, "development": 27.2, "freedom": 37.47, "power": 20.77, "safety": 36.91, "governance": 15.85}, "raw": {"le": 72.884, "gni": 6065, "eys": 10.16220647, "mys": 7.510229074, "elcano": 4.6, "hom": 31.442432, "cpi": 22.0, "fh": 47.0, "rsf": 38.51}}, {"c": "Cameroon", "iso": "CMR", "region": "Africa", "p": {"health": 31.23, "development": 22.92, "freedom": 21.06, "power": 24.64, "safety": 86.54, "governance": 20.8}, "raw": {"le": 63.7, "gni": 4746, "eys": 10.79187965, "mys": 6.574180412, "elcano": 6.4, "hom": 6.7600894, "cpi": 26.0, "fh": 15.0, "rsf": 42.75}}, {"c": "Zimbabwe", "iso": "ZWE", "region": "Africa", "p": {"health": 28.21, "development": 24.94, "freedom": 32.5, "power": 16.11, "safety": 86.55, "governance": 14.61}, "raw": {"le": 62.775, "gni": 3511, "eys": 11.05745312, "mys": 8.930847216, "elcano": 3.1, "hom": 6.7583313, "cpi": 21.0, "fh": 25.0, "rsf": 52.1}}, {"c": "Mauritania", "iso": "MRT", "region": "Africa", "p": {"health": 46.89, "development": 16.5, "freedom": 49.3, "power": 3.21, "safety": 98.13, "governance": 25.75}, "raw": {"le": 68.484, "gni": 6267, "eys": 7.949540636, "mys": 4.852025862, "elcano": 1.1, "hom": 0.9999715, "cpi": 30.0, "fh": 38.0, "rsf": 67.52}}, {"c": "Tajikistan", "iso": "TJK", "region": "Asia", "p": {"health": 57.71, "development": 36.93, "freedom": 8.93, "power": 11.63, "safety": 98.34, "governance": 12.14}, "raw": {"le": 71.79, "gni": 5747, "eys": 10.84980801, "mys": 11.27094825, "elcano": 2.1, "hom": 0.8923708, "cpi": 19.0, "fh": 5.0, "rsf": 32.21}}, {"c": "Jamaica", "iso": "JAM", "region": "North America", "p": {"health": 56.69, "development": 44.91, "freedom": 79.62, "power": 20.18, "safety": 1.0, "governance": 43.08}, "raw": {"le": 71.479, "gni": 10057, "eys": 12.3833955, "mys": 9.959910393, "elcano": 4.4, "hom": 49.299488, "cpi": 44.0, "fh": 81.0, "rsf": 75.83}}, {"c": "Nicaragua", "iso": "NIC", "region": "North America", "p": {"health": 68.04, "development": 37.67, "freedom": 8.7, "power": 14.24, "safety": 77.32, "governance": 5.95}, "raw": {"le": 74.947, "gni": 6881, "eys": 11.51021957, "mys": 9.933019638, "elcano": 2.7, "hom": 11.34732, "cpi": 14.0, "fh": 14.0, "rsf": 22.83}}, {"c": "Myanmar", "iso": "MMR", "region": "Asia", "p": {"health": 41.67, "development": 24.5, "freedom": 4.26, "power": 37.79, "safety": 94.96, "governance": 8.43}, "raw": {"le": 66.889, "gni": 4919, "eys": 11.50456047, "mys": 6.380000114, "elcano": 19.1, "hom": 2.5751011, "cpi": 16.0, "fh": 4.0, "rsf": 25.32}}, {"c": "Venezuela", "iso": "VEN", "region": "South America", "p": {"health": 60.08, "development": 40.77, "freedom": 11.88, "power": 37.4, "safety": 74.71, "governance": 1.0}, "raw": {"le": 72.514, "gni": 7157, "eys": 12.96537654, "mys": 9.678385373, "elcano": 18.4, "hom": 12.646645, "cpi": 10.0, "fh": 13.0, "rsf": 29.21}}, {"c": "Nigeria", "iso": "NGA", "region": "Africa", "p": {"health": 1.0, "development": 26.96, "freedom": 40.6, "power": 41.58, "safety": 68.47, "governance": 20.8}, "raw": {"le": 54.462, "gni": 5569, "eys": 10.51407, "mys": 7.585969925, "elcano": 26.1, "hom": 15.746681, "cpi": 26.0, "fh": 44.0, "rsf": 46.81}}, {"c": "Haiti", "iso": "HTI", "region": "North America", "p": {"health": 35.28, "development": 13.61, "freedom": 30.11, "power": 1.0, "safety": 17.38, "governance": 8.43}, "raw": {"le": 64.936, "gni": 2935, "eys": 10.89635878, "mys": 5.3822999, "elcano": 0.9, "hom": 41.15181, "cpi": 16.0, "fh": 22.0, "rsf": 51.061}}, {"c": "Afghanistan", "iso": "AFG", "region": "Asia", "p": {"health": 38.88, "development": 1.0, "freedom": 2.23, "power": 8.22, "safety": 92.03, "governance": 9.66}, "raw": {"le": 66.035, "gni": 1972, "eys": 10.79014324, "mys": 2.514790058, "elcano": 1.6, "hom": 4.0324583, "cpi": 17.0, "fh": 8.0, "rsf": 17.88}}];
const META = {"n": 112, "dropped": 81, "rsfMatched": 178};

const C = {
  coralLt: "#f58758", coral: "#f56c31", slate: "#3A4F66", navy: "#192a3d",
  grey: "#e6e7e8", teal: "#0a78a7", paper: "#FAFBFC", white: "#ffffff",
  wash: "rgba(245,135,88,0.12)", washStrong: "rgba(245,135,88,0.22)",
  coralText: "#bd571b", coralDot: "#e85f30",
};
const SERIF = '"Requiem Text","Requiem","Hoefler Text","Iowan Old Style",Georgia,serif';
const SANS  = 'avenir-next-lt-pro,"Avenir Next","Segoe UI",system-ui,sans-serif';
const MONO  = "ui-monospace,'SF Mono',Menlo,Consolas,monospace";

const PILLARS = [
  { key: "health",      label: "Health & Longevity",          short: "Health",      hue: "#0a78a7" },
  { key: "development", label: "Material & Human Development", short: "Development", hue: "#3A4F66" },
  { key: "freedom",     label: "Freedom & Rights",            short: "Freedom",     hue: "#6e8fb0" },
  { key: "power",       label: "Power & Influence",           short: "Power",       hue: "#f58758" },
  { key: "safety",      label: "Safety",                      short: "Safety",      hue: "#f56c31" },
  { key: "governance",  label: "Governance & Integrity",      short: "Governance",  hue: "#192a3d" },
];
const TIERS = [
  { name: "Very high",    color: "#0a78a7" },
  { name: "High",         color: "#3A4F66" },
  { name: "Upper-middle", color: "#6e8fb0" },
  { name: "Lower-middle", color: "#f58758" },
  { name: "Lower",        color: "#f56c31" },
];
const PK = PILLARS.map((p) => p.key);
const EQUAL = PILLARS.reduce((o, p) => ((o[p.key] = 50), o), {});
const VALID_REGIONS = new Set(["All", ...new Set(DATA.map((d) => d.region))]);

// Read a shared config from the URL query string. Every field is validated and
// missing/invalid fields are simply omitted, so callers fall back per-field.
function parseConfig() {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  const cfg = {};
  const w = sp.get("w");
  if (w) {
    const parts = w.split(",");
    if (parts.length === PK.length) {
      const wObj = {};
      const ok = parts.every((s, i) => {
        const n = Number(s);
        if (s.trim() === "" || !Number.isFinite(n) || n < 0 || n > 100) return false;
        wObj[PK[i]] = Math.round(n);
        return true;
      });
      if (ok) cfg.weights = wObj;
    }
  }
  const mode = sp.get("mode");
  if (mode === "geometric" || mode === "arithmetic") cfg.mode = mode;
  const region = sp.get("region");
  if (region && VALID_REGIONS.has(region)) cfg.region = region;
  const bands = sp.get("bands");
  if (bands === "1" || bands === "0") cfg.showBands = bands === "1";
  return cfg;
}

// Serialize the current config to a query string. Region is omitted when "All"
// to keep the common case tidy; weights are in PILLAR order.
function buildQuery(weights, mode, region, showBands) {
  const sp = new URLSearchParams();
  sp.set("w", PK.map((k) => weights[k]).join(","));
  sp.set("mode", mode);
  if (region !== "All") sp.set("region", region);
  sp.set("bands", showBands ? "1" : "0");
  return sp.toString();
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through to legacy path */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

function composite(p, w, mode) {
  const S = PK.reduce((a, k) => a + w[k], 0);
  if (S <= 0) return 0;
  if (mode === "arithmetic") return PK.reduce((a, k) => a + w[k] * p[k], 0) / S;
  return Math.exp(PK.reduce((a, k) => a + w[k] * Math.log(p[k]), 0) / S);
}

function Radar({ p, w = 320, h = 252 }) {
  const cx = w / 2, cy = h / 2, R = 68;
  const ang = (i) => -Math.PI / 2 + i * (Math.PI / 3);
  const ringPts = (f) => PILLARS.map((_, i) => `${cx + R * f * Math.cos(ang(i))},${cy + R * f * Math.sin(ang(i))}`).join(" ");
  const dataPts = PILLARS.map((pl, i) => {
    const r = R * (p[pl.key] / 100);
    return [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];
  });
  return (
    <svg width={w} height={h} style={{ display: "block" }} role="img" aria-label={"Radar chart of six pillar scores. " + PILLARS.map((pl) => `${pl.label} ${Math.round(p[pl.key])}`).join(", ") + ", each out of 100."}>
      {[0.25, 0.5, 0.75, 1].map((f) => <polygon key={f} points={ringPts(f)} fill="none" stroke={C.grey} strokeWidth="1" />)}
      {PILLARS.map((pl, i) => <line key={pl.key} x1={cx} y1={cy} x2={cx + R * Math.cos(ang(i))} y2={cy + R * Math.sin(ang(i))} stroke={C.grey} strokeWidth="1" />)}
      <polygon points={dataPts.map((d) => d.join(",")).join(" ")} fill="rgba(245,135,88,0.22)" stroke={C.coral} strokeWidth="2" />
      {dataPts.map((d, i) => <circle key={i} cx={d[0]} cy={d[1]} r="3.2" fill={PILLARS[i].hue} />)}
      {PILLARS.map((pl, i) => {
        const lx = cx + (R + 16) * Math.cos(ang(i)), ly = cy + (R + 16) * Math.sin(ang(i));
        return <text key={pl.key} x={lx} y={ly} fontSize="8.5" fill={C.slate} fontFamily={MONO} letterSpacing="0.3"
          style={{ textTransform: "uppercase" }}
          textAnchor={Math.abs(Math.cos(ang(i))) < 0.3 ? "middle" : (Math.cos(ang(i)) > 0 ? "start" : "end")}
          dominantBaseline="middle">{pl.short} {Math.round(p[pl.key])}</text>;
      })}
    </svg>
  );
}

// worse placement (lower score) on the LEFT, better (higher score) on the RIGHT
function Band({ p5, p95, median, current, n }) {
  const x = (r) => ((n - r) / (n - 1)) * 100;
  const left = x(p95), right = x(p5);
  return (
    <span style={{ position: "relative", display: "block", height: 16 }}>
      <span style={{ position: "absolute", top: 7, left: 0, right: 0, height: 2, background: C.grey }} />
      <span style={{ position: "absolute", top: 5, left: `${left}%`, width: `${Math.max(1.5, right - left)}%`, height: 6, background: "rgba(245,135,88,0.5)", borderRadius: 3 }} />
      <span style={{ position: "absolute", top: 3, left: `${x(median)}%`, width: 2, height: 10, background: C.slate, transform: "translateX(-1px)" }} />
      <span style={{ position: "absolute", top: 2, left: `${x(current)}%`, width: 10, height: 10, borderRadius: "50%", background: C.coralDot, border: "2px solid #fff", transform: "translate(-5px,0)", boxShadow: "0 1px 2px rgba(0,0,0,.3)" }} />
    </span>
  );
}

const fmt = (n, d = 0) => n == null ? "—" : Number(n).toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: d });

const eyebrow = { fontFamily: MONO, fontSize: 10.5, letterSpacing: 2, textTransform: "uppercase", color: C.coralText, fontWeight: 700 };

export default function App() {
  const initial = useMemo(() => parseConfig(), []);
  const [tab, setTab] = useState("rankings");
  const [weights, setWeights] = useState(initial.weights ?? { ...EQUAL });
  const [mode, setMode] = useState(initial.mode ?? "geometric");
  const [region, setRegion] = useState(initial.region ?? "All");
  const [expanded, setExpanded] = useState(null);
  const [showBands, setShowBands] = useState(initial.showBands ?? true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.lang = "en";
    document.title = "BEACON — Byrne Evaluation And Comparison Of Nations";
    const add = (id, attrs) => {
      if (document.getElementById(id)) return;
      const l = document.createElement("link");
      l.id = id;
      Object.assign(l, attrs);
      document.head.appendChild(l);
    };
    // Warm up the Typekit connection before the kit CSS / font files are requested.
    add("tk-preconnect", { rel: "preconnect", href: "https://use.typekit.net", crossOrigin: "anonymous" });
    add("tk-preconnect-css", { rel: "preconnect", href: "https://use.typekit.net" });
    add("tk-hypatia", { rel: "stylesheet", href: "https://use.typekit.net/zjz8ltj.css" });
  }, []);

  // Keep the address bar in sync with the current config so it can be bookmarked,
  // refreshed, and shared via the back/forward stack.
  useEffect(() => {
    const qs = buildQuery(weights, mode, region, showBands);
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [weights, mode, region, showBands]);

  const shareConfig = async () => {
    const qs = buildQuery(weights, mode, region, showBands);
    const url = `${window.location.origin}${window.location.pathname}${qs ? `?${qs}` : ""}`;
    if (await copyText(url)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const N = DATA.length;
  const regions = ["All", ...Array.from(new Set(DATA.map((d) => d.region))).sort()];

  const scored = useMemo(() => {
    const s = DATA.map((d) => ({ ...d, score: composite(d.p, weights, mode) }));
    s.sort((a, b) => b.score - a.score);
    s.forEach((d, i) => { d.rank = i + 1; d.tier = Math.min(4, Math.floor((i / N) * 5)); });
    return s;
  }, [weights, mode, N]);

  const bands = useMemo(() => {
    const draws = 500, ranks = DATA.map(() => []);
    for (let d = 0; d < draws; d++) {
      const w = {}; PK.forEach((k) => (w[k] = Math.random()));
      const arr = DATA.map((row, i) => ({ i, sc: composite(row.p, w, mode) }));
      arr.sort((a, b) => b.sc - a.sc);
      arr.forEach((x, idx) => ranks[x.i].push(idx + 1));
    }
    const o = {};
    DATA.forEach((row, i) => {
      const r = ranks[i].sort((a, b) => a - b);
      o[row.iso] = { p5: r[Math.floor(0.05 * draws)], p95: r[Math.floor(0.95 * draws)], median: r[Math.floor(0.5 * draws)] };
    });
    return o;
  }, [mode]);

  const us = scored.find((d) => d.iso === "USA");
  const shown = region === "All" ? scored : scored.filter((d) => d.region === region);
  const setW = (k, v) => setWeights((w) => ({ ...w, [k]: v }));

  const tabBtn = (id, label) => (
    <button onClick={() => { setTab(id); }} aria-current={tab === id ? "page" : undefined} style={{
      fontFamily: SANS, fontSize: 12.5, letterSpacing: 1.5, textTransform: "uppercase", padding: "7px 2px", marginRight: 26, cursor: "pointer",
      background: "transparent", border: "none", borderBottom: `3px solid ${tab === id ? "#fff" : "transparent"}`,
      color: "#fff", opacity: tab === id ? 1 : 0.7, fontWeight: 700,
    }}>{label}</button>
  );
  const sectionTitle = (txt) => (
    <div style={{ marginBottom: 14 }}>
      <h2 style={{ fontFamily: SERIF, fontSize: 22, color: C.navy, fontWeight: 600, fontVariant: "small-caps", letterSpacing: 0.5, margin: 0 }}>{txt}</h2>
      <div style={{ height: 3, width: 46, background: C.coralLt, marginTop: 6, borderRadius: 2 }} />
    </div>
  );

  return (
    <div style={{ background: C.paper, color: C.slate, fontFamily: SANS, minHeight: "100%" }}>
      <style>{`
        @font-face{font-family:"Requiem Text";src:url("/fonts/RequiemText-HTF-Roman.woff2") format("woff2"),url("https://byrnecreative.com/wp-content/uploads/2022/02/RequiemText-HTF-Roman.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap;}
        @font-face{font-family:"Requiem Text";src:url("/fonts/RequiemText-HTF-Italic.woff2") format("woff2"),url("https://byrnecreative.com/wp-content/uploads/2022/02/RequiemText-HTF-Italic.woff2") format("woff2");font-weight:400;font-style:italic;font-display:swap;}
        @font-face{font-family:"hypatia-sans-pro";src:url("https://use.typekit.net/af/f8d87f/00000000000000003b9adaa2/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff2");font-weight:400;font-style:normal;font-display:swap;}
        @font-face{font-family:"hypatia-sans-pro";src:url("https://use.typekit.net/af/14e069/00000000000000003b9ada9b/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2");font-weight:700;font-style:normal;font-display:swap;}
        @font-face{font-family:"hypatia-sans-pro";src:url("https://use.typekit.net/af/a40319/00000000000000003b9ada9f/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3") format("woff2");font-weight:400;font-style:italic;font-display:swap;}
        @font-face{font-family:"hypatia-sans-pro";src:url("https://use.typekit.net/af/197554/00000000000000003b9ada9c/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i7&v=3") format("woff2");font-weight:700;font-style:italic;font-display:swap;}
        input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:24px;background:transparent;cursor:pointer;margin:0;}
        input[type=range]::-webkit-slider-runnable-track{height:4px;border-radius:4px;background:${C.grey};}
        input[type=range]::-moz-range-track{height:4px;border-radius:4px;background:${C.grey};}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;margin-top:-6px;border-radius:50%;background:${C.coral};cursor:pointer;border:2px solid #fff;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:${C.coral};cursor:pointer;border:2px solid #fff;}
        input[type=range]:focus-visible{outline:2px solid ${C.navy};outline-offset:3px;border-radius:4px;}
        a:focus-visible,button:focus-visible,select:focus-visible,input[type=checkbox]:focus-visible{outline:2px solid ${C.navy};outline-offset:2px;border-radius:3px;}
        .rowbtn{width:100%;text-align:left;background:none;border:none;cursor:pointer;padding:0;font-family:${SANS};color:${C.navy};scroll-margin-top:104px;}
        .rowbtn:hover{background:${C.wash};}
        .rowbtn:focus-visible{outline:2px solid ${C.navy};outline-offset:-2px;}
        a{color:${C.teal};}
        .sr-only{position:absolute !important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
        @media (max-width:520px){
          .bcn-head{display:none;}
          .bcn-row{flex-wrap:wrap;row-gap:8px;}
          .bcn-pill{order:3;}
          .bcn-band{width:100% !important;padding-left:0 !important;order:4;}
        }
      `}</style>

      {/* header */}
      <div style={{ background: "linear-gradient(180deg, #ec6e40 0%, #e85f30 100%)", position: "sticky", top: 0, zIndex: 20, borderBottom: `1px solid rgba(25,42,61,0.12)` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 20px 0" }}>
          <div style={{ fontFamily: SERIF, color: "#fff", fontSize: 26, fontWeight: 600, letterSpacing: 0.3 }}>
            BEACON: Byrne Evaluation And Comparison Of Nations
          </div>
          <div style={{ marginTop: 12 }}>{tabBtn("rankings", "Rankings")}{tabBtn("methodology", "Methodology")}{tabBtn("about", "About")}</div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 20px 70px" }}>

        {tab === "rankings" && <>
          <div className="sr-only" aria-live="polite">{`Rankings updated. ${shown.length} countries shown${shown[0] ? `, led by ${shown[0].c}` : ""}.${us ? ` United States ranks ${us.rank} of ${N} overall.` : ""}`}</div>
          {/* intro */}
          <div style={{ maxWidth: 1180, marginBottom: 40 }}>
            <h1 style={{ fontFamily: SERIF, fontSize: 36, lineHeight: 1.1, margin: "6px 0 16px", fontWeight: 400, color: C.navy, fontStyle: "italic" }}>
              Greatest country on earth? You decide.
            </h1>
            <p style={{ fontSize: 15.5, lineHeight: 1.62, margin: "0 0 12px" }}>
              Even now, Americans hear it regularly: the United States is the greatest country on earth. But is it? And what does that even mean?
            </p>
            <p style={{ fontSize: 15.5, lineHeight: 1.62, margin: "0 0 12px" }}>
              The answer depends on what you value — and how you balance those values against each other. Global might? Material wealth? Personal freedom? It’s up for debate.
              <strong style={{ color: C.navy }}>BEACON</strong> allows you to weight six pillars of national performance and well-being as you see fit: health and longevity, material and human development, freedom and rights, safety, governance and integrity, and a country’s global power and influence.
            </p>
            <p style={{ fontSize: 15.5, lineHeight: 1.62, margin: "0 0 18px" }}>
              Below are {N} countries scored on those six pillars from reputable sources. You decide how much each pillar counts. The rankings then update as you go.
            </p>
          </div>

          <div style={{ display: "flex", gap: 26, flexWrap: "wrap", alignItems: "flex-start" }}>
            {/* controls — raised above the scrolling list so nothing bleeds through */}
            <div style={{ flex: "1 1 290px", minWidth: 270, position: "sticky", top: 92, zIndex: 10, background: C.paper }}>
              <div style={{ background: "#fff", border: `1px solid ${C.grey}`, borderRadius: 10, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <h2 style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.navy, margin: 0 }}>Weigh the Pillars</h2>
                  <button onClick={() => setWeights({ ...EQUAL })} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: C.coralText, background: "none", border: "none", cursor: "pointer", padding: "7px 8px", margin: "-7px -8px", fontWeight: 700 }}>Reset</button>
                </div>
                <div style={{ height: 3, width: 40, background: C.coralLt, borderRadius: 2, marginBottom: 12 }} />
                <p style={{ fontSize: 12, color: C.slate, margin: "0 0 14px" }}>Equal weights aren’t neutral — they assert each pillar matters the same. Your call.</p>
                {PILLARS.map((p) => (
                  <div key={p.key} style={{ marginBottom: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.navy, display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: p.hue }} />{p.label}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 12, color: C.slate }}>{weights[p.key]}</span>
                    </div>
                    <input type="range" min="0" max="100" value={weights[p.key]} aria-label={`Weight for ${p.label}`} style={{ width: "100%" }} onChange={(e) => setW(p.key, +e.target.value)} />
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${C.grey}`, marginTop: 10, paddingTop: 13 }}>
                  <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: C.navy, marginBottom: 10, marginTop: 0 }}>How pillars combine</h3>
                  <div style={{ display: "flex", gap: 6, marginBottom: 11 }}>
                    {[["geometric", "Geometric"], ["arithmetic", "Arithmetic"]].map(([v, l]) => (
                      <button key={v} onClick={() => setMode(v)} aria-pressed={mode === v} style={{ flex: 1, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, fontFamily: SANS, padding: "7px 4px", cursor: "pointer", borderRadius: 6, border: `1px solid ${mode === v ? C.coralText : C.grey}`, background: mode === v ? C.coralText : "#fff", color: mode === v ? "#fff" : C.slate }}>{l}</button>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: C.slate, lineHeight: 1.45, marginBottom: 13 }}>
                    {mode === "geometric" ? "Geometric mean penalizes imbalance — no riding one stellar pillar while flunking another." : "Arithmetic mean lets a strong pillar fully offset a weak one."}
                  </div>
                  <label htmlFor="bcn-region" style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: C.navy, marginBottom: 6 }}>Region</label>
                  <select id="bcn-region" value={region} onChange={(e) => setRegion(e.target.value)} style={{ width: "100%", fontSize: 13, padding: "6px 8px", borderRadius: 6, border: `1px solid ${C.grey}`, background: "#fff", marginBottom: 12, fontFamily: SANS, color: C.navy }}>
                    {regions.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", color: C.slate, minHeight: 24, padding: "4px 0" }}>
                    <input type="checkbox" checked={showBands} onChange={(e) => setShowBands(e.target.checked)} />Show rank-uncertainty bands
                  </label>
                  <button onClick={shareConfig} aria-live="polite" style={{
                    marginTop: 12, width: "100%", fontFamily: SANS, fontSize: 12, letterSpacing: 1, textTransform: "uppercase",
                    fontWeight: 700, padding: "9px 4px", cursor: "pointer", borderRadius: 6, border: `1px solid ${C.coralText}`,
                    background: copied ? "#fff" : C.coralText, color: copied ? C.coralText : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "background 120ms, color 120ms",
                  }}>
                    {copied ? "Link copied" : "Share current config"}
                    {copied ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* rankings */}
            <div style={{ flex: "2 1 560px", minWidth: 340, position: "relative", zIndex: 1 }}>
              {showBands && (
                <div style={{ background: C.wash, border: `1px solid ${C.grey}`, borderLeft: `3px solid ${C.coralLt}`, borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12.5, color: C.slate, lineHeight: 1.5 }}>
                  The bar spans where each country lands across 500 random weightings. Short bar = robust rank; long bar = mostly an artifact of weighting. The <span style={{ color: C.coralDot, fontWeight: 700 }}>●</span> marks its rank under your current weights. Click any country for details.
                </div>
              )}
              <div style={{ background: "#fff", border: `1px solid ${C.grey}`, borderRadius: 10, overflow: "hidden" }}>
                <div className="bcn-head" style={{ display: "flex", alignItems: "center", padding: "9px 14px", borderBottom: `1px solid ${C.grey}`, fontFamily: MONO, fontSize: 10, letterSpacing: 1, color: C.slate, textTransform: "uppercase" }}>
                  <span style={{ width: 28 }}>#</span><span style={{ flex: 1 }}>Country</span>
                  <span style={{ width: 96 }}>Pillars</span>
                  <span style={{ width: 46, textAlign: "right" }}>Score</span>
                  {showBands && <span style={{ width: 140, textAlign: "right" }}>Rank range</span>}
                </div>
                {shown.map((d) => {
                  const b = bands[d.iso], open = expanded === d.iso, isUS = d.iso === "USA";
                  return (
                    <div key={d.iso} style={{ borderBottom: `1px solid ${C.grey}`, background: isUS ? C.wash : "#fff", borderLeft: isUS ? `3px solid ${C.coral}` : "3px solid transparent" }}>
                      <button className="rowbtn" aria-expanded={open} aria-controls={`detail-${d.iso}`} aria-label={`${d.c}, rank ${d.rank} of ${N}, composite score ${d.score.toFixed(1)} of 100`} onClick={() => setExpanded(open ? null : d.iso)}>
                        <div className="bcn-row" style={{ display: "flex", alignItems: "center", padding: "10px 14px", fontSize: 14 }}>
                          <span style={{ width: 28, fontFamily: MONO, color: C.slate, fontSize: 13 }}>{d.rank}</span>
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontWeight: isUS ? 700 : 600, color: C.navy }}>{d.c}</span>
                          </span>
                          <span className="bcn-pill" style={{ width: 96, display: "flex", gap: 2, alignItems: "flex-end", height: 24 }}>
                            {PILLARS.map((p) => <span key={p.key} role="img" aria-label={`${p.short}: ${Math.round(d.p[p.key])}`} title={`${p.short}: ${Math.round(d.p[p.key])}`} style={{ flex: 1, height: `${Math.max(8, d.p[p.key])}%`, background: p.hue, borderRadius: 1 }} />)}
                          </span>
                          <span style={{ width: 46, textAlign: "right", fontFamily: MONO, fontWeight: 700, fontSize: 13.5, color: C.navy }}>{d.score.toFixed(1)}</span>
                          {showBands && <span className="bcn-band" style={{ width: 140, paddingLeft: 12 }}><Band p5={b.p5} p95={b.p95} median={b.median} current={d.rank} n={N} /></span>}
                        </div>
                      </button>
                      {open && (
                        <div id={`detail-${d.iso}`} role="region" aria-label={`${d.c} — detail`} style={{ display: "flex", gap: 26, flexWrap: "wrap", padding: "8px 18px 22px 45px", background: "#fbfcfd" }}>
                          <div style={{ flex: "0 0 auto" }}><Radar p={d.p} /></div>
                          <div style={{ flex: "1 1 300px", minWidth: 260 }}>
                            <div style={{ fontFamily: SERIF, fontSize: 18, marginBottom: 8, color: C.navy, fontVariant: "small-caps", letterSpacing: 0.5 }}>{d.c} <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", color: C.slate, fontVariant: "normal" }}>· {d.region}</span></div>
                            <table style={{ width: "100%", fontSize: 12.5, borderCollapse: "collapse" }}>
                              <tbody>
                                {[
                                  ["Life expectancy", `${fmt(d.raw.le, 1)} yrs`],
                                  ["GNI per capita (PPP)", `$${fmt(d.raw.gni)}`],
                                  ["Schooling (exp / mean)", `${fmt(d.raw.eys, 1)} / ${fmt(d.raw.mys, 1)} yrs`],
                                  ["Global presence (Elcano)", fmt(d.raw.elcano, 0)],
                                  ["Homicide / 100k", fmt(d.raw.hom, 1)],
                                  ["Corruption (CPI 0–100)", fmt(d.raw.cpi)],
                                  ["Freedom House (0–100)", fmt(d.raw.fh)],
                                  ["Press freedom RSF (0–100)", fmt(d.raw.rsf, 1)],
                                ].map(([k, v]) => (
                                  <tr key={k} style={{ borderBottom: `1px solid ${C.grey}` }}>
                                    <td style={{ padding: "4px 8px 4px 0", color: C.slate }}>{k}</td>
                                    <td style={{ padding: "4px 0", textAlign: "right", fontFamily: MONO, fontWeight: 600, color: C.navy }}>{v}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div style={{ fontSize: 11.5, color: C.slate, marginTop: 10, lineHeight: 1.5 }}>
                              Across 500 random weightings this country ranges between #{b.p5} and #{b.p95} (median #{b.median}). The radar shows its six pillar scores, each 0–100 relative to the {N}-country sample.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 11.5, color: C.slate, marginTop: 14, lineHeight: 1.55 }}>
                Scores are relative to these {N} countries, not absolute. Five pillars gauge quality of national life; the sixth, power and influence, gauges global clout. See Methodology for sources, transforms, and caveats.
              </div>
            </div>
          </div>
        </>}

        {tab === "methodology" && (
          <div style={{ maxWidth: 760, fontSize: 14.5, lineHeight: 1.62, color: C.slate }}>
            <div style={eyebrow}>How it’s built</div>
            <h1 style={{ fontFamily: SERIF, fontSize: 32, color: C.navy, margin: "6px 0 10px", fontWeight: 600, fontVariant: "small-caps", letterSpacing: 0.5 }}>Methodology</h1>
            <p>BEACON blends two senses of national “greatness”: how well a country serves the people living in it, and how much it projects power and influence in the world. Five pillars measure quality of national life; the sixth measures global presence. It is built entirely from published, reputable indicators.</p>

            {sectionTitle("The six pillars")}
            <p>Each pillar is one facet of national quality. Within a pillar, sub-indicators are averaged; pillars are then combined into the composite.</p>
            <ol style={s.ol}>
              <li><b>Health &amp; Longevity</b> — life expectancy at birth.</li>
              <li><b>Material &amp; Human Development</b> — GNI per capita (PPP, log-transformed) and education (the average of expected and mean years of schooling).</li>
              <li><b>Freedom &amp; Rights</b> — the average of the Freedom House aggregate score (political rights + civil liberties) and the RSF press-freedom score. Where RSF is unavailable, Freedom House alone is used.</li>
              <li><b>Power &amp; Influence</b> — the Elcano Global Presence Index, capturing a country’s economic, military and soft/cultural projection beyond its borders, log-transformed.</li>
              <li><b>Safety</b> — the intentional-homicide rate, inverted (fewer homicides → higher safety).</li>
              <li><b>Governance &amp; Integrity</b> — the Corruption Perceptions Index (higher = cleaner).</li>
            </ol>

            {sectionTitle("Sources & vintages")}
            <ul style={s.ul}>
              <li>Life expectancy, GNI per capita, schooling — <b>UNDP Human Development Report 2025</b> (2023 reference data).</li>
              <li>Power &amp; influence — <b>Elcano Global Presence Index</b>, 2025 edition (2024 data), Real Instituto Elcano.</li>
              <li>Homicide — <b>UNODC</b> intentional-homicide rate, via Our World in Data, latest available year per country (mostly 2021–2023).</li>
              <li>Corruption — <b>Transparency International CPI</b> (2024 edition), via Our World in Data.</li>
              <li>Freedom House — <b>Freedom in the World</b> aggregate score, 2025 reference year, via Our World in Data.</li>
              <li>Press freedom — <b>Reporters Without Borders</b> World Press Freedom Index 2025.</li>
            </ul>

            {sectionTitle("How the scores are built")}
            <p>Every indicator is rescaled to a 1–100 range across the {META.n}-country sample (min–max), so each pillar is on a common footing. GNI is logged first, reflecting the diminishing returns of income. Homicide is inverted so that higher always means better. The Elcano global-presence score is also log-transformed, so the US/China superpower gap doesn’t swamp the pillar at equal weights — raise the Power slider and that gap reasserts itself. Education combines expected and mean years of schooling; development then combines that with income.</p>
            <p>Pillars are aggregated with a <b>weighted geometric mean</b> by default. The geometric mean penalizes imbalance: a country can’t buy its way to the top on one pillar while flunking another. An arithmetic option is offered for comparison — it lets a strong pillar fully compensate for a weak one.</p>

            {sectionTitle("Weighting is a value judgment")}
            <p>The sliders start at equal weights, but “equal” is itself a choice — it asserts that, say, press freedom matters exactly as much as longevity. There is no objectively correct weighting, which is the point of making it adjustable.</p>

            {sectionTitle("Rank-uncertainty bands")}
            <p>For each country we draw 500 random weightings across all six pillars and record where it lands each time. The bar shows the 5th–95th percentile of those ranks, with lower placements to the left and higher to the right. A short bar means the position is robust to how you weigh things; a long bar means the rank is largely an artifact of weighting and shouldn’t be over-read.</p>

            {sectionTitle("Coverage")}
            <p>BEACON includes <b>{META.n} countries</b> — every country with complete data across all six pillars. Coverage is gated mainly by the homicide series. {META.dropped} countries present in the development data were dropped for missing at least one other pillar; they are excluded rather than imputed.</p>

            {sectionTitle("Reading it honestly")}
            <ul style={s.ul}>
              <li>Scores are <b>relative</b> to this sample, not absolute statements about a country.</li>
              <li>Gaps of a few ranks are noise — trust the uncertainty bands over the exact ordinal.</li>
              <li>Each pillar leans on one or two indicators; it is a deliberately legible index, not an exhaustive one.</li>
              <li>The quality-of-life pillars tend to favour small, rich, peaceful democracies; the Power &amp; Influence pillar deliberately cuts the other way, rewarding large globally-projecting states — so where a country lands depends heavily on how you trade those off.</li>
            </ul>
          </div>
        )}

        {tab === "about" && (
          <div style={{ maxWidth: 680, fontSize: 15.5, lineHeight: 1.66, color: C.slate }}>
            <div style={eyebrow}>The person behind it</div>
            <h1 style={{ fontFamily: SERIF, fontSize: 32, color: C.navy, margin: "6px 0 18px", fontWeight: 600, fontVariant: "small-caps", letterSpacing: 0.5 }}>About</h1>
            <p style={{ margin: "0 0 14px" }}>
              I’m Ben Byrne — a web developer and UX designer based in Santa Rosa, California, with a cross-disciplinary background that
              runs from design to front-end engineering. I spent close to a decade running a creative agency before moving into in-house
              product and web roles.
            </p>
            <p style={{ margin: "0 0 14px" }}>
              Away from the screen I’m a fine-art photographer — <a href="https://gallery.byrnecreative.com" target="_blank" rel="noreferrer">Byrne Creative Photography</a> —
              shooting landscapes, sunsets, forests, and wildlife across Northern California.
            </p>
            <p style={{ margin: "0 0 22px" }}>
              BEACON started as a personal itch: I kept hearing that the United States is “the greatest country on earth,” and I wanted to see
              what happens when you actually try to <em>measure</em> that claim instead of asserting it.
            </p>
            <div style={eyebrow}>Find me</div>
            <p style={{ margin: "6px 0 0", fontSize: 14.5 }}>
              <a href="https://instagram.com/drywallbmb" target="_blank" rel="noreferrer">Instagram @drywallbmb</a>
              <span style={{ color: C.grey, margin: "0 8px" }}>·</span>
              <a href="https://www.threads.net/@drywallbmb" target="_blank" rel="noreferrer">Threads @drywallbmb</a>
              <span style={{ color: C.grey, margin: "0 8px" }}>·</span>
              <a href="mailto:ben@byrnecreative.com">ben@byrnecreative.com</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  ol: { paddingLeft: 20, margin: "6px 0" },
  ul: { paddingLeft: 20, margin: "6px 0" },
};
