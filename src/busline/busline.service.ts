import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { busLineRegistrationDto } from './dto/busLineRegistration.dto';
import { BusLineAddStopDto } from './dto/busLineAddBusStop.dto';

@Injectable()
export class BuslineService {
  constructor(private prisma: PrismaService) {}

  async registerBusLine(dto: busLineRegistrationDto) {
    const { number, pola, czas, part } = dto;
    const connections = czas;
    const stops = pola;

    if (number === '')
      throw new BadRequestException(`Nie podano numeru linii!`);
    if (part === '') throw new BadRequestException(`Nie podano odcinka!`);
    stops.map((stop) => {
      if (stop.id === '')
        throw new BadRequestException(`Nie wybrano przystanku!`);
    });
    connections.map((connection) => {
      if (connection.id === '')
        throw new BadRequestException(
          `Nie podano czasu pomiędzy przystankami!`,
        );
    });

    const foundLine = await this.prisma.busLine.findUnique({
      where: { number: number },
    });
    if (foundLine)
      throw new BadRequestException(
        'Linia jest już zarejestrowana w aplikacji.',
      );

    let fulltime = 0;
    connections.map((connection) => {
      fulltime = fulltime + parseInt(connection.time);
    });

    const busLine = await this.prisma.busLine.create({
      data: {
        number: number,
        fullTime: fulltime,
        part: part,
      },
    });

    stops.map(async (stop) => {
      const BusLineStop = await this.prisma.busLineStop.findMany({
        where: {
          busLine_id: busLine.id,
          busStop_id: parseInt(stop),
        },
      });
      if (BusLineStop.length === 0) {
        await this.prisma.BusLineStop.create({
          data: {
            busLine: { connect: { id: busLine.id } },
            busStop: { connect: { id: parseInt(stop) } },
          },
        });
      }
    });

    connections.map(async (connection) => {
      const busStopFrom = await this.prisma.busStop.findFirst({
        where: { id: parseInt(connection.bustopid_1) },
      });
      const busStopTo = await this.prisma.busStop.findFirst({
        where: { id: parseInt(connection.bustopid_2) },
      });

      const foundConnection = await this.prisma.busStopConnection.findFirst({
        where: {
          busStopFrom_id: busStopFrom.id,
          busStopTo_id: busStopTo.id,
        },
      });

      const foundConnection2 = await this.prisma.busStopConnection.findFirst({
        where: {
          busStopFrom_id: busStopTo.id,
          busStopTo_id: busStopFrom.id,
        },
      });

      if (!foundConnection && !foundConnection2) {
        await this.prisma.busStopConnection.create({
          data: {
            busStopFrom: { connect: { id: busStopFrom.id } },
            busStopTo: { connect: { id: busStopTo.id } },
            time: parseInt(connection.time),
          },
        });

        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              StopConnection_From: busStopFrom.id,
              StopConnection_To: busStopTo.id,
              busLine_id: busLine.id,
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: busLine.id } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: busStopFrom.id,
                    busStopTo_id: busStopTo.id,
                  },
                },
              },
              order: parseInt(connection.order),
            },
          });
        }
      }
      if (foundConnection) {
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              busLine_id: busLine.id,
              StopConnection_From: foundConnection.busStopFrom_id,
              StopConnection_To: foundConnection.busStopTo_id,
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: busLine.id } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: foundConnection.busStopFrom_id,
                    busStopTo_id: foundConnection.busStopTo_id,
                  },
                },
              },
              order: parseInt(connection.order),
            },
          });
        }
      }
      if (foundConnection2) {
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              busLine_id: busLine.id,
              StopConnection_From: foundConnection2.busStopFrom_id,
              StopConnection_To: foundConnection2.busStopTo_id,
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: busLine.id } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: foundConnection2.busStopFrom_id,
                    busStopTo_id: foundConnection2.busStopTo_id,
                  },
                },
              },
              order: parseInt(connection.order),
            },
          });
        }
      }
    });
    return { message: 'Pomyślnie utworzono linię autobusową.' };
  }

  async returnAllBusLine() {
    const busLines = await this.prisma.busLine.findMany();
    return busLines;
  }

  async returnBusLine(id: string) {
    const foundBusline = await this.prisma.busLine.findUnique({
      where: { id: parseInt(id) },
    });
    if (!foundBusline) throw new BadRequestException(`Nie znaleziono linii!`);

    const foundAllBusLineConnection =
      await this.prisma.busLineConnection.findMany({
        where: { busLine_id: parseInt(id) },
      });
    const sortedConnections = foundAllBusLineConnection.sort(
      (a, b) => a.order - b.order,
    );

    const connections = [];

    for (const connection of sortedConnections) {
      const foundConnection = await this.prisma.busStopConnection.findFirst({
        where: {
          busStopFrom_id: connection.StopConnection_From,
          busStopTo_id: connection.StopConnection_To,
        },
        include: { busStopFrom: true, busStopTo: true },
      });

      const temp = {
        busStopFromAddress: foundConnection.busStopFrom.address,
        busStopFromID: foundConnection.busStopFrom_id,
        busStopToAddress: foundConnection.busStopTo.address,
        busStopToID: foundConnection.busStopTo_id,
        time: foundConnection.time,
      };

      connections.push(temp);
    }
    return { busLine: foundBusline, connections: connections };
  }

  async deleteBusLine(id: string) {
    const foundBusline = await this.prisma.busLine.findUnique({
      where: { id: parseInt(id) },
    });
    if (!foundBusline) throw new BadRequestException(`Nie znaleziono linii!`);

    await this.prisma.busLineConnection.deleteMany({
      where: { busLine_id: parseInt(id) },
    });
    await this.prisma.busLineStop.deleteMany({
      where: { busLine_id: parseInt(id) },
    });
    await this.prisma.busLineRoute.deleteMany({
      where: { busLine_id: parseInt(id) },
    });
    await this.prisma.busLine.delete({ where: { id: parseInt(id) } });

    return { message: `Pomyślnie usunięto linie ${foundBusline.number}!` };
  }

  async returnBusLineStops(id: string) {
    const stops = await this.prisma.busLineStop.findMany({
      where: { busLine_id: parseInt(id) },
      include: { busStop: true },
    });
    return stops;
  }

  async returnBusLineStopsFirsLast(id: string) {
    const connections = await this.prisma.busLineConnection.findMany({
      where: { busLine_id: parseInt(id) },
      orderBy: { order: 'asc' },
    });

    const FirstStop = await this.prisma.busStop.findUnique({
      where: { id: connections[0].StopConnection_From },
    });
    const LastStop = await this.prisma.busStop.findUnique({
      where: { id: connections[connections.length - 1].StopConnection_To },
    });
    return { firstStop: FirstStop, lastStop: LastStop };
  }

  async addStop(dto: BusLineAddStopDto) {
    const { newStopID, time, type, busStop, busLineID } = dto;

    if (type === 'FIRST') {
      const busStopFrom = await this.prisma.busStop.findFirst({
        where: { id: parseInt(newStopID) },
      });
      const busStopTo = await this.prisma.busStop.findFirst({
        where: { id: parseInt(busStop) },
      });
      const foundBusLineConnections =
        await this.prisma.busLineConnection.findMany({
          where: { busLine_id: parseInt(busLineID) },
          orderBy: { order: 'asc' },
        });

      foundBusLineConnections.map(async (connection) => {
        await this.prisma.busLineConnection.update({
          where: {
            StopConnection_From_StopConnection_To_busLine_id: {
              busLine_id: parseInt(busLineID),
              StopConnection_From: connection.StopConnection_From,
              StopConnection_To: connection.StopConnection_To,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });
      });

      const foundConnection = await this.prisma.busStopConnection.findFirst({
        where: {
          busStopFrom_id: busStopFrom.id,
          busStopTo_id: busStopTo.id,
        },
      });

      const foundConnection2 = await this.prisma.busStopConnection.findFirst({
        where: {
          busStopFrom_id: busStopTo.id,
          busStopTo_id: busStopFrom.id,
        },
      });

      if (!foundConnection && !foundConnection2) {
        await this.prisma.busStopConnection.create({
          data: {
            busStopFrom: { connect: { id: busStopFrom.id } },
            busStopTo: { connect: { id: busStopTo.id } },
            time: parseInt(time),
          },
        });
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              StopConnection_From: busStopFrom.id,
              StopConnection_To: busStopTo.id,
              busLine_id: parseInt(busLineID),
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: parseInt(busLineID) } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: busStopFrom.id,
                    busStopTo_id: busStopTo.id,
                  },
                },
              },
              order: 0,
            },
          });
        }
      }
      if (foundConnection) {
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              busLine_id: parseInt(busLineID),
              StopConnection_From: foundConnection.busStopFrom_id,
              StopConnection_To: foundConnection.busStopTo_id,
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: parseInt(busLineID) } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: foundConnection.busStopFrom_id,
                    busStopTo_id: foundConnection.busStopTo_id,
                  },
                },
              },
              order: 0,
            },
          });
        }
      }
      if (foundConnection2) {
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              busLine_id: parseInt(busLineID),
              StopConnection_From: foundConnection2.busStopFrom_id,
              StopConnection_To: foundConnection2.busStopTo_id,
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: parseInt(busLineID) } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: foundConnection2.busStopFrom_id,
                    busStopTo_id: foundConnection2.busStopTo_id,
                  },
                },
              },
              order: 0,
            },
          });
        }
      }
      await this.prisma.busLineStop.create({
        data: {
          busLine: { connect: { id: parseInt(busLineID) } },
          busStop: { connect: { id: parseInt(newStopID) } },
        },
      });
    } else if (type === 'END') {
      const busStopFrom = await this.prisma.busStop.findFirst({
        where: { id: parseInt(busStop) },
      });
      const busStopTo = await this.prisma.busStop.findFirst({
        where: { id: parseInt(newStopID) },
      });
      const foundBusLineConnections =
        await this.prisma.busLineConnection.findMany({
          where: { busLine_id: parseInt(busLineID) },
          orderBy: { order: 'asc' },
        });

      const foundConnection = await this.prisma.busStopConnection.findFirst({
        where: {
          busStopFrom_id: busStopFrom.id,
          busStopTo_id: busStopTo.id,
        },
      });

      const foundConnection2 = await this.prisma.busStopConnection.findFirst({
        where: {
          busStopFrom_id: busStopTo.id,
          busStopTo_id: busStopFrom.id,
        },
      });

      if (!foundConnection && !foundConnection2) {
        await this.prisma.busStopConnection.create({
          data: {
            busStopFrom: { connect: { id: busStopFrom.id } },
            busStopTo: { connect: { id: busStopTo.id } },
            time: parseInt(time),
          },
        });
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              StopConnection_From: busStopFrom.id,
              StopConnection_To: busStopTo.id,
              busLine_id: parseInt(busLineID),
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: parseInt(busLineID) } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: busStopFrom.id,
                    busStopTo_id: busStopTo.id,
                  },
                },
              },
              order:
                foundBusLineConnections[foundBusLineConnections.length - 1]
                  .order + 1,
            },
          });
        }
      }
      if (foundConnection) {
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              busLine_id: parseInt(busLineID),
              StopConnection_From: foundConnection.busStopFrom_id,
              StopConnection_To: foundConnection.busStopTo_id,
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: parseInt(busLineID) } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: foundConnection.busStopFrom_id,
                    busStopTo_id: foundConnection.busStopTo_id,
                  },
                },
              },
              order:
                foundBusLineConnections[foundBusLineConnections.length - 1]
                  .order + 1,
            },
          });
        }
      }
      if (foundConnection2) {
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              busLine_id: parseInt(busLineID),
              StopConnection_From: foundConnection2.busStopFrom_id,
              StopConnection_To: foundConnection2.busStopTo_id,
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: parseInt(busLineID) } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: foundConnection2.busStopFrom_id,
                    busStopTo_id: foundConnection2.busStopTo_id,
                  },
                },
              },
              order:
                foundBusLineConnections[foundBusLineConnections.length - 1]
                  .order + 1,
            },
          });
        }
      }
      await this.prisma.busLineStop.create({
        data: {
          busLine: { connect: { id: parseInt(busLineID) } },
          busStop: { connect: { id: parseInt(newStopID) } },
        },
      });
    } else {
      const foundBusLineConnection =
        await this.prisma.busLineConnection.findFirst({
          where: {
            busLine_id: parseInt(busLineID),
            busStopConnection: { busStopFrom_id: parseInt(busStop) },
          },
        });
      const busStopBefore = await this.prisma.busStop.findUnique({
        where: { id: foundBusLineConnection.StopConnection_From },
      });
      const busStopAfter = await this.prisma.busStop.findUnique({
        where: { id: foundBusLineConnection.StopConnection_To },
      });
      const stop = await this.prisma.busStop.findUnique({
        where: { id: parseInt(newStopID) },
      });
      const order = foundBusLineConnection.order;
      console.log(busStopBefore, busStopAfter, stop);

      await this.prisma.busLineConnection.delete({
        where: {
          StopConnection_From_StopConnection_To_busLine_id: {
            busLine_id: parseInt(busLineID),
            StopConnection_From: foundBusLineConnection.StopConnection_From,
            StopConnection_To: foundBusLineConnection.StopConnection_To,
          },
        },
      });

      const foundBusLineConnections =
        await this.prisma.busLineConnection.findMany({
          where: { busLine_id: parseInt(busLineID) },
        });

      foundBusLineConnections.map(async (connection) => {
        if (connection.order > order) {
          await this.prisma.busLineConnection.update({
            where: {
              StopConnection_From_StopConnection_To_busLine_id: {
                busLine_id: parseInt(busLineID),
                StopConnection_From: connection.StopConnection_From,
                StopConnection_To: connection.StopConnection_To,
              },
            },
            data: {
              order: {
                increment: 2,
              },
            },
          });
        }
      });

      const foundConnection = await this.prisma.busStopConnection.findFirst({
        where: {
          busStopFrom_id: busStopBefore.id,
          busStopTo_id: stop.id,
        },
      });

      const foundConnection2 = await this.prisma.busStopConnection.findFirst({
        where: {
          busStopFrom_id: stop.id,
          busStopTo_id: busStopBefore.id,
        },
      });

      const foundConnection1 = await this.prisma.busStopConnection.findFirst({
        where: {
          busStopFrom_id: stop.id,
          busStopTo_id: busStopAfter.id,
        },
      });

      const foundConnection12 = await this.prisma.busStopConnection.findFirst({
        where: {
          busStopFrom_id: busStopAfter.id,
          busStopTo_id: stop.id,
        },
      });

      if (!foundConnection && !foundConnection2) {
        await this.prisma.busStopConnection.create({
          data: {
            busStopFrom: { connect: { id: busStopBefore.id } },
            busStopTo: { connect: { id: stop.id } },
            time: parseInt(time),
          },
        });
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              StopConnection_From: busStopBefore.id,
              StopConnection_To: stop.id,
              busLine_id: parseInt(busLineID),
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: parseInt(busLineID) } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: busStopBefore.id,
                    busStopTo_id: stop.id,
                  },
                },
              },
              order: order,
            },
          });
        }
      }
      if (foundConnection) {
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              busLine_id: parseInt(busLineID),
              StopConnection_From: foundConnection.busStopFrom_id,
              StopConnection_To: foundConnection.busStopTo_id,
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: parseInt(busLineID) } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: foundConnection.busStopFrom_id,
                    busStopTo_id: foundConnection.busStopTo_id,
                  },
                },
              },
              order: order,
            },
          });
        }
      }
      if (foundConnection2) {
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              busLine_id: parseInt(busLineID),
              StopConnection_From: foundConnection2.busStopFrom_id,
              StopConnection_To: foundConnection2.busStopTo_id,
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: parseInt(busLineID) } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: foundConnection2.busStopFrom_id,
                    busStopTo_id: foundConnection2.busStopTo_id,
                  },
                },
              },
              order: order,
            },
          });
        }
      }

      if (!foundConnection1 && !foundConnection12) {
        await this.prisma.busStopConnection.create({
          data: {
            busStopFrom: { connect: { id: stop.id } },
            busStopTo: { connect: { id: busStopAfter.id } },
            time: parseInt(time),
          },
        });
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              StopConnection_From: stop.id,
              StopConnection_To: busStopAfter.id,
              busLine_id: parseInt(busLineID),
            },
          });
        if (!foundBusLineConnection) {
            console.log(stop.id, busStopAfter.id)
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: parseInt(busLineID) } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: stop.id,
                    busStopTo_id: busStopAfter.id,
                  },
                },
              },
              order: order + 1,
            },
          });
        }
      }
      if (foundConnection1) {
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              busLine_id: parseInt(busLineID),
              StopConnection_From: foundConnection1.busStopFrom_id,
              StopConnection_To: foundConnection1.busStopTo_id,
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: parseInt(busLineID) } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: foundConnection1.busStopFrom_id,
                    busStopTo_id: foundConnection1.busStopTo_id,
                  },
                },
              },
              order: order + 1,
            },
          });
        }
      }
      if (foundConnection12) {
        const foundBusLineConnection =
          await this.prisma.busLineConnection.findFirst({
            where: {
              busLine_id: parseInt(busLineID),
              StopConnection_From: foundConnection12.busStopFrom_id,
              StopConnection_To: foundConnection12.busStopTo_id,
            },
          });
        if (!foundBusLineConnection) {
          await this.prisma.busLineConnection.create({
            data: {
              busLine: { connect: { id: parseInt(busLineID) } },
              busStopConnection: {
                connect: {
                  busStopFrom_id_busStopTo_id: {
                    busStopFrom_id: foundConnection12.busStopFrom_id,
                    busStopTo_id: foundConnection12.busStopTo_id,
                  },
                },
              },
              order: order + 1,
            },
          });
        }
      }
      await this.prisma.busLineStop.create({
        data: {
          busLine: { connect: { id: parseInt(busLineID) } },
          busStop: { connect: { id: parseInt(newStopID) } },
        },
      });
    }

    return { message: 'Pomyślnie dodano przystanek do linii.' };
  }
}
