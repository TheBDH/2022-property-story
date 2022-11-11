library("dplyr")
library("crosswalkr")

#Include all API endpoints in the list api_endpoints

api_endpoints <- list(
  "https://data.providenceri.gov/resource/e3qk-fibu.csv",
  "https://data.providenceri.gov/resource/fek9-hu38.csv",
  "https://data.providenceri.gov/resource/fvsz-rky3.csv",
  "https://data.providenceri.gov/resource/yqdi-fbw5.csv",
  "https://data.providenceri.gov/resource/aymi-rpqq.csv",
  "https://data.providenceri.gov/resource/iafn-rvmp.csv",
  "https://data.providenceri.gov/resource/swgn-agtw.csv",
  "https://data.providenceri.gov/resource/9p3h-3q5i.csv",
  "https://data.providenceri.gov/resource/p6bs-8exs.csv",
  "https://data.providenceri.gov/resource/cj3e-g66x.csv",
  "https://data.providenceri.gov/resource/fgwg-7viq.csv",
  "https://data.providenceri.gov/resource/a6uy-vymr.csv",
  "https://data.providenceri.gov/resource/t2vi-f8qs.csv",
  "https://data.providenceri.gov/resource/r8g6-9zdt.csv",
  "https://data.providenceri.gov/resource/czje-unnn.csv",
  "https://data.providenceri.gov/resource/ku9m-5rhr.csv",
  "https://data.providenceri.gov/resource/yghh-hsch.csv",
  "https://data.providenceri.gov/resource/twey-459r.csv",
  "https://data.providenceri.gov/resource/y9h5-fefu.csv",
  "https://data.providenceri.gov/resource/fawc-z8zq.csv",
  "https://data.providenceri.gov/resource/c3q4-f95q.csv")
PropertyCrosswalk <- read.csv("~/Downloads/Crosswalk Property Final.csv")
CrosswalkCols <- colnames(PropertyCrosswalk)
MAP <- c()
ADDRESS <- c()
ZIP <- c()
OWNER <- c()
ASSMT <- c()
EXEMPT <- c()
TAXES <- c()
DATAYEAR <- c()
output_df <- data.frame(MAP, ADDRESS, ZIP, OWNER, ASSMT, EXEMPT, TAXES)
for (i in 1:1){
  print(i)
  temp_df <- read.socrata(
    api_endpoints[[i]], 
    app_token = "kTSBOnhygkgOdgxEjlpwlwWiM",
    email = "neil_mehta@brown.edu",
    password = ""
    )
  # Handle 2007 case
  if (i == 6){
    temp_df$location_zip <- ''
  }
  Mapper <- data.frame()
  Mapper <- cbind(PropertyCrosswalk[,1:2], PropertyCrosswalk[,(24-i)])
  colnames(Mapper)[3] = "OriginalLabels"
  temp_df <- renamefrom(temp_df, Mapper, OriginalLabels, clean)
  # Index assumes we're starting from 200
  temp_df$DATAYEAR <- rep(toString(i+2001), nrow(temp_df))
  output_df <- rbind(output_df, temp_df)
  print(colnames(output_df))
  print(i)
}