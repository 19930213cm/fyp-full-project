using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

[Flags]
public enum BonusType
{
    None,
    DestroyWholeRowColumn
}


public static class BonusTypeUtilities
{
    public static bool ContainsDestroyWholeRowColumn(BonusType bt)
    {
        return (bt & BonusType.DestroyWholeRowColumn) 
            == BonusType.DestroyWholeRowColumn;
    }
}

public enum GameState
{
    None,
    SelectionStarted,
    Animating
}
