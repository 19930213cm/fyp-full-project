using System.Collections;
using System.Collections.Generic;
using System.Net;
using UnityEngine;
using System;
using System.IO;

public class levelSelectSceneManager : MonoBehaviour {
    nodeServerCalls node = new nodeServerCalls();
     
    // Use this for initialization
    void Start () {
        instantiatePlayerJson(); 
    }
	
	// Update is called once per frame
	void Update () {
		
	}

    void instantiatePlayerJson()
    {
        JSONObject j = node.getPlayerDoc("chris");
        playerVariables.PlayerJson = j;
    } 

    IEnumerator WaitForRequest(WWW www)
    {
        yield return www;

        if (www.error == null)
        {
            Debug.Log(www.text);

        }
        else
        {
            Debug.LogError(www.error);
        }
    }


}
