using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

[System.Serializable]
public class PlayerInfo
{
    string name, email;
    int logingTally, currentLevel, currentCoins, currentStars; 
    struct bonuses
    {

    }

    public static PlayerInfo CreateFromJSON(string jsonString)
    {
        return JsonUtility.FromJson<PlayerInfo>(jsonString);
    }
        
}
