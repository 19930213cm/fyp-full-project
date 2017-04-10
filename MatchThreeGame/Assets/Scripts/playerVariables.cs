using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

class playerVariables
{
    static private JSONObject playerJson;

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

}

