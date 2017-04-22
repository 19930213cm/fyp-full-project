using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class levelSelect : MonoBehaviour {

    public void NextLevelButton(int index)
    {
        SceneManager.LoadScene(index);
    }

    public void NextLevelButton(string levelName)
    {
        PlayerVariables.currentLevel = levelName; 
        SceneManager.LoadScene(levelName);
    }

    public void NextLevelButton(string levelName, bool gameLevel)
    {
        if (gameLevel)
        {
            int playerLives = Int32.Parse(PlayerVariables.PlayerJson.GetField("lives").ToString());

            if (playerLives > 0)
                SceneManager.LoadScene(levelName);
            else
            {

            }
        }
    }
}
