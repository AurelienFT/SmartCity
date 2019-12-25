from enum import Enum as enum
import random

class Type(enum):
    NONE = 0,
    RESIDENTIAL = 1,
    COMMERCIAL = 2,
    INDUSTRIAL = 3,
    ROAD = 7

class Cell:
    def __init__(self, i, j):
        if not isinstance(i, int):
            raise TypeError("Error in Cell constructor first parameter must be int")
        if not isinstance(j, int):
            raise TypeError("Error in Cell constructor second parameter must be int")
        self.i = i
        self.j = j
        self.type = Type.NONE
        self.id = -1

class Map:

    def __init__(self, mapSize):
        if not isinstance(mapSize, int):
            raise TypeError("Error in Map constructor first parameter must be int")
        self.mapSize = mapSize
        self.cells = []
        self.grid = []
        self.minSize = 4
        self.maxSize = 10
        for i in range(0, self.mapSize):
            tmp = []
            for y in range(0, self.mapSize):
                tmp.append(Cell(i, y))
            self.grid.append(tmp)
        self.getAllCells()
        self.handleGeneration()

    def getAllCells(self):
        i = 0
        j = 0
        while(i < self.mapSize):
            while (j < self.mapSize):
                self.cells.append(self.grid[i][j])
                j += 2
            i += 2
    
    def randomRange(self, min, max):
        return (random.randint(0, (max - min + min)))

    def IsInBound(self, i, j):
        return not(i < 0 or i >= self.mapSize or j < 0 or j >= self.mapSize)

    def display(self):
        for i in range(0, self.mapSize):
            for j in range(0, self.mapSize):
                print(self.grid[i][j].type, end=" ")
            print()

    def handleGeneration(self):
        zones = [Type.RESIDENTIAL, Type.COMMERCIAL, Type.COMMERCIAL, Type.RESIDENTIAL, Type.INDUSTRIAL]

        for curTile in range(0, (len(self.cells))):
            if (self.cells[curTile].type == Type.NONE):
                direction = 1 if random.randint(0, 100) > 50 else 0
                squareWidth = self.randomRange(self.minSize, (self.maxSize if direction else self.minSize))
                squareHeight = self.randomRange(self.minSize, (self.minSize if direction else self.mapSize))

                zone = zones[random.randint(0, len(zones) - 1)]
                i = 0
                while i < squareWidth:
                    j = 0
                    while j < squareHeight:
                        if ( self.IsInBound((self.cells[curTile].i + i + 1), self.cells[curTile].j + j + 1)):
                            self.grid[self.cells[curTile].i + i][self.cells[curTile].j + j].id = curTile
                            self.grid[self.cells[curTile].i + i][self.cells[curTile].j + j].type = zone

                            self.grid[self.cells[curTile].i + i+1][self.cells[curTile].j + j].id = curTile
                            self.grid[self.cells[curTile].i + i+1][self.cells[curTile].j + j].type = zone

                            self.grid[self.cells[curTile].i + i][self.cells[curTile].j + j + 1].id = id
                            self.grid[self.cells[curTile].i + i][self.cells[curTile].j + j + 1].type = zone

                            self.grid[self.cells[curTile].i + i+1][self.cells[curTile].j + j + 1].id = id
                            self.grid[self.cells[curTile].i + i+1][self.cells[curTile].j + j + 1].type = zone
                        j += 2
                    i += 2

a = Map(10)
a.display()