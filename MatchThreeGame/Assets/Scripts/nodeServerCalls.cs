using System;
using System.Net;
using System.IO;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.Networking.NetworkSystem;

public static class nodeServerCalls
{
    //android emulator
    //public static string baseUrl = "http://10.0.2.2:3000";
    public static string baseUrl = "http://192.168.0.18:3000";
   //public static string baseUrl = "http://localhost:3000";
    static string mEmail = Constants.getemail(); 
    const short MyBeginMsg = 1002;

    static NetworkClient m_client; 

    public static void instantiatePlayerJson()
    {

        Debug.Log("email call:" + mEmail);
        JSONObject j = getPlayerDoc(mEmail);
        PlayerVariables.PlayerJson = j;
    }

    public static JSONObject requestNewLife()
    {
        var responseValue = string.Empty;
        string url = baseUrl + "/match3/generateNewLife";
        UriBuilder builder = new UriBuilder(url);
        string query = "playerId=" + mEmail;
        builder.Query = query;
        return getCall(builder);
    }


    public static JSONObject getHighscores(string levelName)
    {
        var responseValue = string.Empty;
        string url = baseUrl + "/match3/getHighscores";
        UriBuilder builder = new UriBuilder(url);
        string query = "levelName=" + levelName;
        builder.Query = query;
        return getCall(builder);
    }

    public static JSONObject sendHighscores(string levelName, int score)
    {
        var responseValue = string.Empty;
        string url = baseUrl + "/match3/sendHighscore";
        UriBuilder builder = new UriBuilder(url);
        string query = "levelName=" + levelName + "&playerId=" + mEmail + "&score=" + score;
        query = query.Replace("\"", "");
        builder.Query = query;
        return getCall(builder);
    }

    public static JSONObject getPlayerDoc(string playerId)
    {
        var responseValue = string.Empty;
        string url = baseUrl + "/match3/getPlayerDoc";
        UriBuilder builder = new UriBuilder(url);
        string query = "playerId=" + playerId;
        builder.Query = query;
        return getCall(builder); 
    }

    public static JSONObject sendPlayerDoc()
    {
        JSONObject obj = PlayerVariables.PlayerJson;
        string[] keys = obj.keys.ToArray();
        string param = keys[0] + "=" + obj.GetField(keys[0]);  
        for(int i = 1; i < keys.Length; i++)
        {
            param += "&" + keys[i] + "=" + obj.GetField(keys[i]);

        }

        param = param.Replace("\"", "");

        var responseValue = string.Empty;
        string url = baseUrl + "/match3/postPlayerDoc";
        UriBuilder builder = new UriBuilder(url);
        builder.Query = param;
        return getCall(builder);
    }


    public static JSONObject uploadHighscore(string playerId, string levelId, int score)
    {
        var responseValue = string.Empty;
        string url = baseUrl + "/match3/getPlayerDoc";
        UriBuilder builder = new UriBuilder(url);
        string[] keys = {"playerId", "levelId", "score"};
        string[] values = { playerId, levelId, score.ToString()};
        string query = buildQueryString(keys, values); 
        builder.Query = query;
        return getCall(builder);
    }

    private static string buildQueryString(string[] keys, string[] values)
    {
        string query = keys[0] + "=" + values[0];

        for (int i = 1; i < keys.Length; i++)
        {
            query += "&" + keys[i] + "=" + values[i];
        }

        return query;
    }

    private static JSONObject postCall(UriBuilder url, string body)
    {

        var responseValue = string.Empty;

        //HttpWebRequest request = WebRequest.Create(url.ToString()) as HttpWebRequest;
        //request.Method = "POST";

        //Debug.Log(body);

        //byte[] buf = Encoding.ASCII.GetBytes(body);
        //Debug.Log(buf.ToString());
        //string anotherString = Encoding.ASCII.GetString(buf);
        //Debug.Log(anotherString);
        //Debug.Log(buf.Length);

        //request.ContentType = "application/json; charset=UTF-8";
        //request.ContentLength = buf.Length;

        //Stream dataStream = request.GetRequestStream();

        //dataStream.Write(buf, 0, buf.Length);
        //dataStream.Close();

        //request.GetResponse(); 
        //using (HttpWebResponse response = request.GetRessponse() as HttpWebResponse)
        //{
        //    if (response.StatusCode != HttpStatusCode.OK)
        //        throw new Exception(String.Format("Server error (HTTP {0}: {1}).", response.StatusCode,
        //            response.StatusDescription));

        //    using (var responseStream = response.GetResponseStream())
        //    {
        //        using (var reader = new StreamReader(responseStream))
        //        {
        //            responseValue += reader.ReadToEnd();
        //        }
        //    }
        //}
        return new JSONObject(responseValue);
    }

    private static JSONObject getCall(UriBuilder url)
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




    //public static void SendReadyToBeginMessage(int myId)
    //{
    //    var msg = new IntegerMessage(myId);
    //    m_client.Send(MyBeginMsg, msg);
    //}

    //public static void Init()
    //{
    //    m_client = new NetworkClient();
    //    m_client.Connect("localhost", 3000);
    //    NetworkServer.RegisterHandler(MyBeginMsg, OnServerReadyToBeginMessage);
    //    //SendReadyToBeginMessage(1); 
    //}

    static void OnServerReadyToBeginMessage(NetworkMessage netMsg)
    {
        var beginMessage = netMsg.ReadMessage<IntegerMessage>();
        Debug.Log("received OnServerReadyToBeginMessage " + beginMessage.value);
    }
}

