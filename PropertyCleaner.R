library("dplyr")
library("crosswalkr")

#Include all API endpoints in the list api_endpoints

api_endpoints <- list("https://data.providenceri.gov/resource/c3q4-f95q.csv","")
PropertyCrosswalk <- read.csv("PropertyCrosswalk.csv")
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
for (i in 1:(length(api_endpoints))){
  print(i)
  temp_df <- read.csv(api_endpoints[[i]])
  Mapper <- as.data.frame(cbind(PropertyCrosswalk[,1:2], PropertyCrosswalk[i+2]))
  Mapper <- Mapper %>% rename("Original" = 3)
  temp_df <- renamefrom(temp_df, cw_file=Mapper, raw=Original, clean=clean, label=label)
  
  # Index assumes we're starting from 2002
  
  temp_df$DATAYEAR <- rep(toString(i+2001), nrow(temp_df))
  output_df <- rbind(output_df, temp_df)
  print(head(output_df))
}
