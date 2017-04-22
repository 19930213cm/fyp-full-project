using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class livesManager : MonoBehaviour {
    float countdown;
    protected livesManager() { }


    // Use this for initialization
    void Start () {
        initTImer(); 
        
	}
	
	// Update is called once per frame
	void Update () {
        countdownToNextLife(); 

    }

    void countdownToNextLife()
    {
        if (countdown <= 0)
        {
            int lives = PlayerVariables.getInt("lives");
            int maxLives = PlayerVariables.getInt("maxLives");

            PlayerVariables.PlayerJson.SetField("lives", (lives + 1).ToString());
            nodeServerCalls.sendPlayerDoc();
            
            nodeServerCalls.instantiatePlayerJson(); 
            if (lives < maxLives)
            {
                initTImer(); 
            } else
            {
                Destroy(this); 
            }
            // + lives, send to server, pull from server, increase text of lives on page, if last life remove timer, if not run this again
        }
        countdown -= Time.deltaTime; 
    }

    void initTImer()
    {
        countdown = Constants.lifeRechageTime;
    }
}
