//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Linq;
//using System.Net;
//using System.Text.RegularExpressions;
////using Newtonsoft.Json.Linq;

//public class AlternateRoute
//{
//    private string key = "AIzaSyCRY6UjqpIuztD1TzGcXU6lTxAUPOMhrrc";
//    private string api = "https://maps.googleapis.com/maps/api/directions/json?";
//    private string map = "https://www.google.co.uk/maps/place/";
//    private string _origin;
//    private string _destination;

//    public AlternateRoute(string origin, string destination)
//    {
//        _origin = origin;
//        _destination = destination;
//    }

//    public string GetInstructions()
//    {
//        var responseValue = GetApiResponse();
//        return Instructions(responseValue);
//    }

//    public float GetDriving()
//    {
//        try
//        {
//            var responseValue = GetApiResponse();
//            return FormatText(responseValue);
//        }
//        catch (Exception ex)
//        {
//            return 0;
//        }
//    }

//    private string GetApiResponse()
//    {
//        var responseValue = string.Empty;
//        var url = string.Format("{0}origin={1}&destination={2}&key={3}", api, _origin.Replace(' ', '+'),
//            _destination.Replace(' ', '+'), key);
//        HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;

//        using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
//        {
//            if (response.StatusCode != HttpStatusCode.OK)
//                throw new Exception(String.Format("Server error (HTTP {0}: {1}).", response.StatusCode,
//                    response.StatusDescription));

//            using (var responseStream = response.GetResponseStream())
//            {
//                using (var reader = new StreamReader(responseStream))
//                {
//                    responseValue += reader.ReadToEnd();
//                }
//            }
//        }
//        return responseValue;
//    }

//    private string Instructions(string responseValue)
//    {
//        if (responseValue == String.Empty)
//        {
         
//        }
//        var str = JObject.Parse(responseValue);
//        var rep = str.SelectTokens("routes[0].legs[0].steps").Children().ToList();
//        var direct = new List<Directions>();
            
//        foreach (var r in rep)
//        {
//            direct.Add(new Directions()
//            {
//                Distance = r.SelectToken("distance.text").ToString(),
//                Duration = r.SelectToken("duration.text").ToString(),
//                Instr = r.SelectToken("html_instructions").ToString()
//            });
            
//        }
            
//        var strg = "";
             
//        foreach (var d in direct)
//        {
//            strg += d.Output();
//        }

//        return "<b><u> Directions</u>  <br /> From: " + _origin + " To: " + _destination + " </b><br/>" + strg;
//    }

//    private float FormatText(string responseValue)
//    {
//        if (responseValue == String.Empty)
//        {
//            return 0;
//        }
//        else
//        {
//            var str = JObject.Parse(responseValue);
//            var time = str.SelectToken("routes[0].legs[0].duration.text").ToString();

//            if (new Regex(@"\d+ hours").IsMatch(time))
//            {
//                return GetMinutes(time,"hours");
//            }
//            if (new Regex(@"\d hour").IsMatch(time))
//            {
//                return GetMinutes(time,"hour");
//            }

//            var mindex = time.IndexOf("min");
//            var subMin = time.Substring(0, mindex);

//            return Int32.Parse(subMin);
//        }
//    }
    
//    private float GetMinutes(string time, string hour)
//    {
//        var index = time.IndexOf(hour);
//        var subHr = time.Substring(0, index);
        
//        var lindex = index + hour.Length + 1;
//        var rMin = time.Remove(0, lindex);
//        var mindex = rMin.IndexOf("min");

//        var subMin = rMin.Substring(0, mindex);

//        return (Int32.Parse(subHr)*60) + Int32.Parse(subMin);
//    }
//}

//public class Directions
//{
//    public string Distance;
//    public string Duration;
//    public string Instr;

//    public string Output()
//    {
//        return "<p> Distance: " + Distance + " Time: " + Duration + "<br />" + Instr + "</p>";
//    }
//}
