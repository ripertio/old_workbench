import folium
import geopandas as gpd
from  pyproj import CRS
import branca.colormap as cm
import saga_api
import numpy as np
import math
import csv
import pandas as pd
import os

###################################################################
####### Import Daten + Aufbereitung nötiger Variablen #############
###################################################################



# Import data(Zeitliche Darstellung von Daten zu Covid19 Fällen je Bezirk) from: https://covid19-dashboard.ages.at/data/CovidFaelle_Timeline_GKZ.csv mit
#####Achtung: Linux verhindert den Downdload gelegentlich. Daher die Datei "how_to_enable_url_download_Linux" beachten####
url1 = "https://covid19-dashboard.ages.at/data/CovidFaelle_Timeline_GKZ.csv"
#Lokal:
#url1 = "CovidFaelle_Timeline_GKZ.csv"

panda_df = pd.read_csv(url1, sep=';')

#Bezirks array 
raw_data = panda_df.to_numpy() #speichern des Dataframes von Pandas zu einem Numpy array

#Variablen die in Bezirks Array übertragen werden sollen 
bezirke = raw_data[:,1] # Anzahl der Bezirke Österreich 95
anzahl = raw_data[:,4]
GKZ = raw_data[:,2]
Zeit = raw_data[:,0]
anzahl_ew = raw_data[:,3]
Sieben_Tage_Inzedenz = raw_data[:,7]
TotSum = raw_data[:,9]


#Nur die Tagesaktuellen Werte werden in neue Variable gespeichert 
Zeit_aktuell = Zeit[len(GKZ)-94:]
GKZ_aktuell = GKZ [len(GKZ)-94:]
Sieben_Tage_Inzedenz_aktuell = Sieben_Tage_Inzedenz [len(GKZ)-94:]
anzahl_ew_aktuell = anzahl_ew[len(GKZ)-94:]
TotSum_aktuell = TotSum[len(GKZ)-94:]

# Import Impfdaten Länder from:
url = "https://info.gesundheitsministerium.gv.at/data/laender.csv"
#Lokal:
#url = "laender.csv"

panda_df_laender = pd.read_csv(url, sep=';')
panda_df_laender['geoid'] = panda_df_laender.index.astype(int)

# Länder array
raw_data_laender = panda_df_laender.to_numpy() #speichern des Dataframes von Pandas zu einem Numpy array
raw_data_laender = np.delete (raw_data_laender, (9,10), axis=0) #verkürzen des Arrays auf die Neun bundesländer


#Variablen die in Länder Array übertragen werden sollen
ID = raw_data_laender [:,7]
ID = ID+1 #Index würde sonst bei 0 Anfangen 
laender = raw_data_laender[:,0]
auslieferung_pro_100 = raw_data_laender[:,2]

#########################################################################################
############################ Verarbeitung DATEN  ########################################
#########################################################################################

 # Berechnung aktuelle 7-Tages-Inzidenzen aller Bezirke nach GKZ
i = 1
inf_der_letzten_sieben_tage = [] # Infektionen der letzten sieben Tage
for i in range (1,8):
    anzahl_inf_tag = anzahl[len(GKZ)-94*i:len(GKZ)-94*i+94] # Infektionszahlen werden auf die letzten sieben Tage zurück gerechnet
    inf_der_letzten_sieben_tage.append(anzahl_inf_tag)
    i += 1


Gesamt_inf_sieben_Tage = np.array(sum(inf_der_letzten_sieben_tage)) # Infektionen der letzten sieben Tage werden zusammen addiert


Inzidenz_bez = [] # meine berechnete sieben Tages-Inzidenz

#print(Gesamt_inf_sieben_Tage)
Inzidenz_bez.append(Gesamt_inf_sieben_Tage * 100000 / anzahl_ew_aktuell)
Inzidenz_bez_aktuell = np.array(Inzidenz_bez[0]) # liste zu numpy array

TotproEW =[] # Berechnung der Toten pro 100 000 ew 
TotproEW.append(TotSum_aktuell* 100000 / anzahl_ew_aktuell)
TotproEW_aktuell =np.array(TotproEW[0], dtype=int)
#print("Test",TotproEW_aktuell)

#Covid Daten  Bezirke nach GKZ 
DataBezirke_Covid = np.stack((Zeit_aktuell, GKZ_aktuell, anzahl_ew_aktuell, Sieben_Tage_Inzedenz_aktuell, TotproEW_aktuell), axis=1)

#Um GEO-array und Data array später zusammenführen zu können --> float/int. array wird zu string array convertiert
# Array für Übergabe in GEO Daten
finalArray = np.asarray(DataBezirke_Covid, dtype = np.str,order ='C')
print ('Hier ist der Array mit den Inzidenzen')
print ("Datum; GKZ der Bezirke; Anzahl Einwohner; 7-TagesInzedenz, Tote summe ")
#print(finalArray)


# Berechnung der 7-Tages-Inzidenz nach Bundesländern
Bund = np.stack((GKZ_aktuell, anzahl_ew_aktuell,Gesamt_inf_sieben_Tage, TotSum_aktuell), axis=1)

Bund_einwohner = []
Bund_inf_sieben = []
Bund_tot = []
x = 0
y = 0
z = 0
j = 1
k = 1
for k in range (1,10):
    for j in range (0,94):
        if int(str(Bund[j][0])[0]) == k:
            x += Bund[j][1]
            y += Bund[j][2]
            z += Bund[j][3]
        j+=1
    Bund_einwohner.append(x)
    Bund_inf_sieben.append(y)
    Bund_tot.append(z) ##### Tote pro 100000 EW
    x=0
    y=0
    z=0
    k += 1

Bund_einwohner = np.array(Bund_einwohner)
Bund_inf_sieben = np.array(Bund_inf_sieben)
Bund_tot = np.array(Bund_tot)

Inzidenz_bund = [] # berechnete sieben Tages-Inzidenz pro Bundesland
Verstorben_bund = []

Inzidenz_bund.append(np.divide(Bund_inf_sieben, Bund_einwohner)*100000)
Verstorben_bund.append(np.divide(Bund_tot, Bund_einwohner)*100000)
Verstorbene_bund = np.array(Verstorben_bund[0])
Inzidenz_bund = np.array(Inzidenz_bund[0]) #liste zu numpy array


# COVID Daten  Laender nach GKZ (GKZ = ID)
DataArray_Laender = np.stack((ID, laender, Bund_einwohner, Inzidenz_bund, Verstorbene_bund, auslieferung_pro_100), axis=1) #Sum Tote fehlt

#Um GEO-array und Data array später zusammenführen zu können --> float/int. array wird zu string array convertiert
finalArray_laender = np.asarray(DataArray_Laender, dtype = np.str,order ='C')
print ('Hier ist der Länder Array mit den COVID Daten + Impfung')
print ("GKZ Bundesländer; Name der Länder; einwohner Länder; 7 Tagesinzidenz Länder, Auslieferung von Impfdosen pro 100 Einwohner")
#print(finalArray_laender)


print ("Verarbeitung ENDE")
############################################################################
###################  Verarbeitung Ende #####################################
############################################################################




###########################################################################
######################Export###############################################
###########################################################################
print ("Start Import der Shapefiles + Verarbeitung dieser")
##########################################################
#Zusammenfügen der Bezirkarrays###########################
##########################################################

####convert shp to geojson ####
bezirke = r"covid19livemap/Shapes/BezirkeV1.shp"
laender =r'covid19livemap/Shapes/BundesländerV1.shp'

bezirke_raw = gpd.read_file(bezirke)
#bezirke_raw.to_file("covid19livemap/bezirke_raw.geojson", driver="GeoJSON")
bezirke_raw.KENNZAHL =bezirke_raw.KENNZAHL.astype(str)
#print (type(bezirke_raw))
#print( bezirke_raw.head())

laender_raw =gpd.read_file(laender)
#laender_raw.to_file("covid19livemap/laender_raw.geojson", driver="GeoJSON")
laender_raw.KENNZAHL =laender_raw.KENNZAHL.astype(str)
#print( type(laender_raw))

#Projektion festlegen - WGS 84
bezirke_raw.crs = CRS.from_epsg(4326)
laender_raw.crs = CRS.from_epsg(4326)



finalArray_laender = pd.DataFrame(finalArray_laender)
finalArray_laender.columns = ['KENNZAHL', 'Name', 'Bund_einwohner', 'Inzidenz_bund', 'Verstorbene_bund','Auslieferung_ Impfdosen pro 100 Einwohner']
#print(finalArray_laender.head())

finalArray_bezirk =pd.DataFrame(finalArray)
finalArray_bezirk.columns =['datum', 'KENNZAHL', 'Einwohner', '7TagesInzedenz', 'Tote pro 100 000']
#print(finalArray_bezirk.dtypes)


bezirke_shp = pd.merge(bezirke_raw, finalArray_bezirk,how="left", on='KENNZAHL')
bezirke_shp["7TagesInzedenz"] = bezirke_shp["7TagesInzedenz"].str.replace(',','.')
bezirke_shp = bezirke_shp.apply(pd.to_numeric, errors='ignore')
bezirke_shp = gpd.GeoDataFrame(bezirke_shp, geometry="geometry")


bezirke_shp.to_file("covid19livemap/bezirke_all.geojson", driver="GeoJSON")
#print ("\nto_numeric: \n BEZIRKE \n",bezirke_shp.dtypes)




laender_shp = pd.merge(laender_raw, finalArray_laender,how="left", on='KENNZAHL')
print(laender_shp)
laender_shp = laender_shp.apply(pd.to_numeric, errors='ignore')
laender_shp = gpd.GeoDataFrame(laender_shp, geometry="geometry")
laender_shp.to_file("covid19livemap/laender_all.geojson", driver="GeoJSON")
print ("\nto_numeric: \n LÄNDER \n",laender_shp.dtypes)
bezirke_shp.crs = CRS.from_epsg(4326)
laender_shp.crs = CRS.from_epsg(4326)
##################################################
################ creat basic map ##################
###################################################
map = folium.Map(location=[47.69, 13.34], tiles='cartodbpositron', zoom_start=8, control_scale=True)


################################
#### Daten Verarbeitung   ######
################################
inzidenz7_cm = cm.linear.YlOrRd_05.scale(bezirke_shp.loc[bezirke_shp['7TagesInzedenz']>0, '7TagesInzedenz'].min(), bezirke_shp.loc[bezirke_shp['7TagesInzedenz']>0, '7TagesInzedenz'].max())
inzidenz7_cm.caption = "7 Tages Inzidenz der Bezrike"
impfung_cm = cm.linear.Blues_09.scale(laender_shp.loc[laender_shp['Auslieferung_ Impfdosen pro 100 Einwohner']>0, 'Auslieferung_ Impfdosen pro 100 Einwohner'].min(), laender_shp.loc[laender_shp['Auslieferung_ Impfdosen pro 100 Einwohner']>0, 'Auslieferung_ Impfdosen pro 100 Einwohner'].max())
impfung_cm.caption = "Ausgelieferte Impfdosen pro 100 Einwohner*innen je Bundesland"
tote_cm = cm.linear.Greys_09.scale(bezirke_shp.loc[bezirke_shp['Tote pro 100 000']>0, 'Tote pro 100 000'].min(), bezirke_shp.loc[bezirke_shp['Tote pro 100 000']>0, 'Tote pro 100 000'].max())
tote_cm.caption = "Verstorbene pro 100 000 Einwohner*innen je Bezirk"
tote_cm_laender = cm.linear.Greys_09.scale(laender_shp.loc[laender_shp['Verstorbene_bund']>0, 'Verstorbene_bund'].min(), laender_shp.loc[laender_shp['Verstorbene_bund']>0, 'Verstorbene_bund'].max())
tote_cm_laender.caption = "Verstorbene pro 100 000 Einwohner*innen je Bundesland"

map.add_child(inzidenz7_cm)
map.add_child(impfung_cm)
map.add_child(tote_cm)
map.add_child(tote_cm_laender)

##### Map 7 Tagesinzidenz Bezirke ######## 
folium.GeoJson(bezirke_shp[['geometry','NAME','7TagesInzedenz', 'datum']],
               name="7 Tages Inzidenz der Bezrike",
               style_function=lambda x: {"weight":2, 'color':'grey','fillColor':inzidenz7_cm(x['properties']['7TagesInzedenz']), 'fillOpacity':0.7},
               highlight_function=lambda x: {'weight':3, 'color':'black'},
               smooth_factor=2.0,
               tooltip=folium.features.GeoJsonTooltip(fields=['NAME','7TagesInzedenz', 'datum'],
                                              aliases=['','7 Tages Inzidenz', 'datum'], 
                                              labels=True, 
                                              sticky=True,
                                              toLocaleString=True
                                             )
              ).add_to(map)

#### MAP Impfung ####
a = folium.GeoJson(laender_shp[['geometry','Name','Auslieferung_ Impfdosen pro 100 Einwohner',]],
               name="Ausgelieferte Impfdosen pro 100 Einwohner*innen je Bundesland",
               style_function=lambda x: {"weight":2, 'color':'grey','fillColor':impfung_cm(x['properties']['Auslieferung_ Impfdosen pro 100 Einwohner']), 'fillOpacity':0.7},
               highlight_function=lambda x: {'weight':3, 'color':'black'},
               smooth_factor=2.0,
               tooltip=folium.features.GeoJsonTooltip(fields=['Name','Auslieferung_ Impfdosen pro 100 Einwohner'],
                                              aliases=['','Anzahl Auslieferung pro 100 EW',], 
                                              labels=True, 
                                              sticky=True,
                                              toLocaleString=True,
                                             )
              ).add_to(map)


#### MAP Verstorbene Länder ####
folium.GeoJson(laender_shp[['geometry','Name','Verstorbene_bund',]],
               name="Verstorbene pro 100 000 Einwohner*innen je Bundesland",
               style_function=lambda x: {"weight":2, 'color':'grey','fillColor':tote_cm_laender(x['properties']['Verstorbene_bund']), 'fillOpacity':0.7},
               highlight_function=lambda x: {'weight':3, 'color':'black'},
               smooth_factor=2.0,
               tooltip=folium.features.GeoJsonTooltip(fields=['Name','Verstorbene_bund'],
                                              aliases=['','Verstorbene_bund / 100 000 EW',], 
                                              labels=True, 
                                              sticky=True,
                                              toLocaleString=True,
                                             )
              ).add_to(map)
### Layer - Verstorbene Der Bezirke pro 100 000 Einwohner
folium.GeoJson(bezirke_shp[['geometry','NAME','Tote pro 100 000',]],
               name="Verstorbene pro 100 000 Einwohner*innen je Bezirk",
               style_function=lambda x: {"weight":2, 'color':'grey','fillColor':tote_cm(x['properties']['Tote pro 100 000']), 'fillOpacity':0.7},
               highlight_function=lambda x: {'weight':3, 'color':'black'},
               smooth_factor=2.0,
               tooltip=folium.features.GeoJsonTooltip(fields=['NAME','Tote pro 100 000'],
                                              aliases=['','Anzahl Tote pro 100 000',], 
                                              labels=True, 
                                              sticky=True,
                                              toLocaleString=True,
                                              show=False,
                                             )
              ).add_to(map)


folium.LayerControl().add_to(map)
map.fit_bounds([46.321260016761585, 9.213742540031431],[49.08125860240949, 17.09194958202092])

#creating webpage
outfp = "covid19livemap/covid19_livemaps.html"
map.save(outfp)



print ("DONE")
