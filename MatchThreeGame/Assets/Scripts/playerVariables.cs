using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

class PlayerVariables
{
    static private JSONObject playerJson;
    public static string currentLevel;
    public static int newScore;

    public static JSONObject PlayerJson
    {
        get
        {
            return playerJson;
        }
        set
        {
            playerJson = value;
        }
    }



    public static int getInt(string field)
    {
        if (PlayerJson.HasField(field)){
            int value;
            string param = PlayerJson.GetField(field).ToString();
            param = param.Replace("\"", "");
            value = int.Parse(param);
            return value;
        }
        return -1; 
    }

    public static string getString(string field)
    {
        if (PlayerJson.HasField(field))
        {
            string param = PlayerJson.GetField(field).ToString();
            param = param.Replace("\"", "");
            return param;
        }
        return "field not found";
    }

    public static bool getBool(string field)
    {
        if (PlayerJson.HasField(field))
        {
            bool value;
            string param = PlayerJson.GetField(field).ToString();
            param = param.Replace("\"", "");
            value = bool.Parse(param);
            return value;
        }
        return false;
    }
}

