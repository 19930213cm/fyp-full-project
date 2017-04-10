using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.IO; 
public class LevelManager{
    string levelName;
    int[][] data;
    public string filePath; 
    public string result;
    // Use this for initialization

    // Update is called once per frame
    public LevelManager(string levelName)
    {
        this.levelName = levelName;

    }

    public LevelData getLevelData()
    {
        return new LevelData(levelName);
    }

    void Example()
    {
        Debug.Log(filePath); 
        if (filePath.Contains("://"))
        {
            Debug.Log("file found"); 
            WWW www = new WWW(filePath);
            result = www.text;
        }
        else
            result = System.IO.File.ReadAllText(filePath);
    }


   

}
