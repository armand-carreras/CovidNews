import { RegionData } from "./region-data";

export interface CountryData {
    
    name?: string;
    global:{
        Last_update?: string;
        TodayConfirmed?: number;
        TodayDeaths?: number;
        TodayRecovered?: number;
        YesterdayConfirmed?: number;
        YesterdayDeaths?: number;
        YesterdayRecovered?: number;
        todayVsYesterdayConfirmed?: number;
        todayVsYesterdayDeaths?: number;
        todayVsYesterdayRecovered?: number;
    }
    country:{
        last_update?: string;
        regions?: RegionData[];
        TodayConfirmed?: number;
        TodayDeaths?: number;
        TodayHospitalizedPatients?: number;
        TodayIntensiveCare?: number;
        TodayRecovered?: number;
        YesterdayConfirmed?: number;
        YesterdayDeaths?: number;
        YesterdayHospitalizedPatients?: number;
        YesterdayIntensiveCare?: number;
        YesterdayRecovered?: number;
        todayVsYesterdayConfirmed?: number;
        todayVsYesterdayDeaths?: number;
        todayVsYesterdayRecovered?: number;
        todayVsYesterdayHospitalizedPatients?: number;
        todayVsYesterdayIntensiveCare?: number;
    }
    
}
