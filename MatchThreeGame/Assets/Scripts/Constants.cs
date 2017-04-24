using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

public static class Constants
{
/// <summary>
/// gameplay constants
/// </summary>
    public static readonly int Rows = 10;
    public static readonly int Columns = 8;
    public static readonly float AnimationDuration =  0.2f;

    public static readonly float MoveAnimationMinDuration = 0.05f;

    public static readonly float ExplosionDuration = 0.3f;

    public static readonly float WaitBeforePotentialMatchesCheck = 2f;
    public static readonly float OpacityAnimationFrameDelay = 0.05f;

    public static readonly int MinimumMatches = 3;
    public static readonly int MinimumMatchesForBonus = 4;

    public static readonly int Match3Score = 60;
    public static readonly int SubsequentMatchScore = 1000;

    public static readonly int goalSteps = 8000;


/// <summary>
/// store cost constants
/// </summary>
    public static readonly int refreshLives_Cost = 5;
    public static readonly int increaseLives_Cost = 15;

/// <summary>
/// reward constants
/// </summary>
    public static readonly int dailyReward = 10;
        
/// <summary>
    /// life recharge counter
    /// </summary>
    public static float lifeRechageTime = 30 * 60f;

    public static string accountName; 

    public static string getemail()
    {
        AndroidJavaClass jc_unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
        AndroidJavaObject jo_Activity = jc_unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
        // get android.accounts.AccountManager and call android.accounts.AccountManager.getAccountsByType
        AndroidJavaClass jc_AccountManager = new AndroidJavaClass("android.accounts.AccountManager");
        AndroidJavaObject jo_AccountManager = jc_AccountManager.CallStatic<AndroidJavaObject>("get", jo_Activity);
        AndroidJavaObject jo_Accounts = jo_AccountManager.Call<AndroidJavaObject>("getAccountsByType", "com.google");
        // convert java accounts into array
        AndroidJavaObject[] jo_AccountsArr = AndroidJNIHelper.ConvertFromJNIArray<AndroidJavaObject[]>(jo_Accounts.GetRawObject());
        if (jo_AccountsArr.Length > 0) return jo_AccountsArr[0].Get<string>("name");

        return "christophertmartin1993@gmail.com"; 
        
    }

}



