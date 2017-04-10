using System;
using System.Net;
using System.IO;

public class nodeServerCalls
{
    //android emulator
    string baseUrl = "http://10.0.2.2:3000/match3";
    //dev machine localhost
    //string baseUrl = "http://localhost:3000/match3/";

    public  JSONObject getPlayerDoc(string playerId)
    {
        var responseValue = string.Empty;
        string url = baseUrl + "/getPlayerDoc";
        UriBuilder builder = new UriBuilder(url);
        string query = "playerId=" + playerId;
        builder.Query = query;
        return makeCall(builder); 
    }

    private JSONObject makeCall(UriBuilder url)
    {
        var responseValue = string.Empty;

        HttpWebRequest request = WebRequest.Create(url.ToString()) as HttpWebRequest;
        using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
        {
            if (response.StatusCode != HttpStatusCode.OK)
                throw new Exception(String.Format("Server error (HTTP {0}: {1}).", response.StatusCode,
                    response.StatusDescription));

            using (var responseStream = response.GetResponseStream())
            {
                using (var reader = new StreamReader(responseStream))
                {
                    responseValue += reader.ReadToEnd();
                }
            }
        }
        return new JSONObject(responseValue);
    }
}

