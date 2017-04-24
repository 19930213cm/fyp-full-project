using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameOver_SceneManager : MonoBehaviour {
    Text reasonText; 
	// Use this for initialization
	void Start () {
        getText();
        setText(); 
	}
	
	// Update is called once per frame
	void Update () {
		
	}

    void OnDestroy()
    {

    }

    void getText()
    {
        GameObject canvas = GameObject.Find("Canvas");
        Text[] t = canvas.GetComponentsInChildren<Text>(); 
        reasonText = t[0]; 
    }

    void setText()
    {
        reasonText.text = "You ran out of moves"; 
    }
}
