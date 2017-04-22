using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.IO;
using UnityEngine.SceneManagement;
using System;
using UnityEngine.Networking; 

public class LevelManager : MonoBehaviour
{
    JSONObject obj = PlayerVariables.PlayerJson; 
    public void manageLevelState(int score, int targetScore, int remainingMoves)
    {
        if (shouldGameEnd( score,  targetScore,  remainingMoves))
        {
            Debug.Log("end game");

            if (remainingMoves < 1)
            {
                outOfMoves();
            }else
            {
                completeLevel();

            }

        }
    }
    private bool shouldGameEnd(int score, int targetScore, int remainingMoves)
    {
        if (score > targetScore || remainingMoves < 1)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private void outOfMoves()
    {
        string param = obj.GetField("lives").ToString();
        param = param.Replace("\"", "");
        int lives = int.Parse(param);
        lives--;
        obj.SetField("lives", lives);

        nodeServerCalls.sendPlayerDoc(); 
        SceneManager.LoadScene("GameOverScene");

    }

    private void completeLevel()
    {

        string param = obj.GetField("currentLevel").ToString(); 
        param = param.Replace("\"", "");
        int level = int.Parse(param);
        level++;
        obj.SetField("currentLevel", level); 

        nodeServerCalls.sendPlayerDoc();
        SceneManager.LoadScene("LevelComplete");

        //upload score to server
        //show scores of other users
    }


    public IEnumerator Upload()
    {
        //List<IMultipartFormSection> formData = new List<IMultipartFormSection>();
        //for (var i = 0; i < PlayerVariables.PlayerJson.)
        //formData.Add(new MultipartFormDataSection("field1=foo&field2=bar"));
        //formData.Add(new MultipartFormFileSection("my file data", "myfile.txt"));

        
        UnityWebRequest www = UnityWebRequest.Post(nodeServerCalls.baseUrl + "/postPlayerDoc", PlayerVariables.PlayerJson.ToString());
        yield return www.Send();
        if (www.isError)
        {
            Debug.Log(www.error);
        }
        else
        {
            Debug.Log("Form upload complete!");
            SceneManager.LoadScene("LevelComplete");

        }
    }

}
